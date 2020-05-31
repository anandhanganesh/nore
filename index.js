const urlParser=require('url');
const fileType=require('file-type');
const mime=require('mime-types');
const zlib=require('zlib');
const {http,https}=require('follow-redirects');

const defaultPort=80;
const defaultProtocol='http:';

const unCompressData=(data,contentEncode)=>{
    switch(contentEncode){
        case 'gzip':
        case 'deflate':
            return zlib.unzipSync(data);
        case 'br':
            return zlib.brotliDecompressSync(data);
        default:
            return data;
    }
}


const getContentTypeAndData=async (data,contentType,contentEncode)=>{
    var viewable=true;
    data = unCompressData(Buffer.concat(data),contentEncode);

    if((data && typeof data=='object'))
    {
    if(!contentType)
        contentType=(await fileType.fromBuffer(Buffer.from(data))).mime;
    
    if(!contentType.includes('application/json') && !contentType.includes('text') && !contentType.includes('application/xml')  && !contentType.includes('application/xhtml+xml'))
        viewable=false;
    }

    if(viewable)
        data=data.toString();

    return [data,contentType,mime.extension(contentType),viewable];
}


const slicePath=(sliceString)=>{
    var splitedParts=sliceString.split('/');
    if(splitedParts.length>1)
        return [splitedParts[0],'/'+(splitedParts.splice(1).join('/'))];
    else
        return [splitedParts[0],'/'];
}

const getProtocolFromString=(urlString)=>{
    var urlParts=urlParser.parse(urlString);
    const {protocol,port,hostname,path,pathname,search,auth}=urlParts;
    if(!protocol && !port){
            const [host,path]=slicePath(pathname);
        return [defaultProtocol,defaultPort,host,search?path+search:path,auth];
    }else if(protocol!=='http:' && protocol!=='https:'){
        return [defaultProtocol,hostname||defaultPort,protocol.replace(':',''),path,auth];
    }else{
        return [protocol,protocol==='https:'?port||443:port||defaultPort,hostname,path,auth];
    }   
}

const bakeCookies=unCooked=>{
      return unCooked.map(cookie=>{
        let baked={Secure:false,HttpOnly:false}
         cookie.split('; ').forEach(cook=>{
             let halfBaked=cook.split('=');
             if(halfBaked.length==1){
                return baked[halfBaked[0]]=true;
             }
             if(halfBaked[0]!=='domain' && halfBaked[0]!=='path' && halfBaked[0]!=='expires'){
                    baked.name=halfBaked[0];
                    baked.value=halfBaked[halfBaked.length-1];
                    return;
             }
             baked[halfBaked[0]]=halfBaked[halfBaked.length-1];
         })
         return baked;
       })
}



const Requester=(method,myUrl,content,headers,cb)=>{    
    const [protocol,port,hostname,path,auth]=getProtocolFromString(myUrl);
    const  contentString=(typeof content==='string')?content:JSON.stringify(content);

    console.log(mime.extension('text/html'));
    if((typeof content==='object' && Object.keys(content).length!=0) || (typeof content==='string' && content))
        headers={...headers,'Content-length':Buffer.byteLength(contentString)};

    const requestOptions={
        protocol,
        method,
        hostname,
        port,
        path,
        headers,
        auth
    }

    var response={
        data:[],
    }
    const callback=(res)=>{
        res.on('data',d=>{
            response.data.push(d);
        });
        res.on('end',async ()=>{
            const [respData,resContentType,fileExtension,viewable]=await getContentTypeAndData(response.data,response.headers['content-type'],response.headers['content-encoding']);
            response.data=respData;
            response.headers['content-type']=resContentType;
            response.viewable=viewable;
            response.fileExtension=fileExtension;
            cb(null,response);
        });
        res.on('error',(error)=>{cb(error)});
    }

    const request=(protocol==='https:')?https.request(requestOptions,callback):http.request(requestOptions,callback);

    request.on('response',(res)=>{
        response.headers=res.headers;
        response.status=res.statusMessage;
        response.statusCode=res.statusCode;
        response.raw=res;
        if(res.headers['set-cookie']){
            response.cookies=bakeCookies(res.headers['set-cookie']);
            delete response.headers['set-cookie'];
        }
    });

    request.on('timeout',(res)=>{
        cb('Could n\'t Reach Time out');
    });

    if(method!=='GET' && method!=='HEAD')
        request.write(contentString);
    request.end();
}

module.exports=Requester;
