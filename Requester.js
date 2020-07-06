const Form=require('form-data');
const fs=require('fs');
const qs=require('query-string');
const {http,https}=require('follow-redirects');

const { getProtocolFromString,bakeCookies,getContentTypeAndData } = require('./common/util');

const structureContent=(contentType,content,cb)=>{
    var structured;
    var structHead={};
    if(contentType.includes('application/json')){
        if(content.constructor==String){
            try{
                let obj=JSON.parse(content);
                structured=content;
            }catch(err){
                return cb(err.message);
            }
        }else if(typeof content == 'object'){
            structured=JSON.stringify(content);
        }else{
            return cb(new Error('Invalid Content For JSON PARSE'));
        }
        structHead['Content-Length']=structured.length;
        structHead['Content-Type']='application/json; charset=UTF-8'
    }else if(contentType.includes('application/x-www-form-urlencoded')){
        if(content.constructor==String){
            if(!content){
                structured=content
            }else if(typeof qs.parse(content) == 'object'){
                structured=content
            }else{
                return cb('INVALID X-WWW-FORM-URLENCODED STRING');
            }
        }else if(content.constructor==Object){
            structured=qs.stringify(content);
        }else{
            return  cb('Couldn\'t Process This Content');
        }
        structHead['Content-Length']=structured.length;
        structHead['Content-Type']='application/x-www-form-urlencoded; charset=UTF-8'
    }else if(contentType.includes('multipart/form-data')){
        if(content instanceof Form){
            structured=content;
        }else if(typeof content == 'object'){
            const keys=Object.keys(content);
            const fd=new Form();
            for(var i=0;i<keys.length;i++){
                if(/File/i.test(keys[i])){
                    try{
                        fd.append(keys[i],fs.createReadStream(keys[i].value));
                    }catch(err){
                        return cb(new Error("INVALID FILE URL"));
                    }
                }else if(/Value/i.test(keys[i])){
                        fd.append(keys[i],keys[i].value);
                }
            }
            structHead={...structHead,...fd.getHeaders()}
        }
    }else if(contentType.includes('text/plain')){
            structured=new String(content);
            structHead['Content-Type']='text/plain';
            structHead['Content-Length']=structured.length;
    }else{
            return cb(new Error('Data couldn\'t be send for this contentType'));
    }
    return cb(null,{reqCont:structured,contentHead:structHead});
}


const Requester=async ({method="GET",myUrl,contentType='application/x-www-form-urlencoded; charset=UTF-8',content="",headers={}},cb)=>{    
    var startTime=Date.now();
    const [protocol,port,hostname,path,auth]=getProtocolFromString(myUrl);
    const {scErr,dat}=structureContent(contentType,content,(err,dat)=>({err,dat}));
    if(scErr)
        return cb(scErr)
    const {reqCont,contentHead}=dat;
    headers={...headers,...contentHead};
    const requestOptions={
        protocol,
        method,
        hostname,
        port,
        path,
        headers,
    }
    if(auth){
        requestOptions.auth=auth;
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
        response.time=Date.now()-startTime;
        if(res.headers['set-cookie']){
            response.cookies=bakeCookies(res.headers['set-cookie']);
            delete response.headers['set-cookie'];
        }
    });
    request.on('timeout',(res)=>{
        cb('Could n\'t Reach Time out');
    });
   
    
    if(method!=='GET' && method!=='HEAD')
     {
         if(contentType.includes('multipart/form-data')){
             reqCont.pipe(request).on('unpipe',()=>{
                 request.end();
             });
         }else{
            request.write(reqCont);
            request.end();
         }
     }else{
         request.end();
     }   
    request.on('error',(err)=>{
        cb(err.message);
    });
}
module.exports=Requester;