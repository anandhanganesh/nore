const urlParser=require('url');
const zlib=require('zlib');
const fileType=require('file-type');
const mime=require('mime-types');
const qs=require('query-string');
const { DEFAULT_PORT, DEFAULT_PROTOCOL } = require('./const');

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

module.exports={
    unCompressData,
    slicePath:(sliceString)=>{
        var splitedParts=sliceString.split('/');
        if(splitedParts.length>1)
            return [splitedParts[0],'/'+(splitedParts.splice(1).join('/'))];
        else
            return [splitedParts[0],'/'];
    },
    getProtocolFromString:(urlString)=>{
        var urlParts=urlParser.parse(urlString);
        const {protocol,port,hostname,path,pathname,search,auth}=urlParts;
        if(!protocol && !port){
                const [host,path]=this.slicePath(pathname);
            return [DEFAULT_PROTOCOL,DEFAULT_PORT,host,search?path+search:path,auth];
        }else if(protocol!=='http:' && protocol!=='https:'){
            return [DEFAULT_PROTOCOL,hostname||DEFAULT_PORT,protocol.replace(':',''),path,auth];
        }else{
            return [protocol,protocol==='https:'?port||443:port||DEFAULT_PORT,hostname,path,auth];
        }   
    },
    bakeCookies:unCooked=>{
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
    },
    getContentTypeAndData:async (data,contentType,contentEncode)=>{
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
}