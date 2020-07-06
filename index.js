const Requester=require('./Requester');

function nore(method,url,contentType,content,headers,cb){
    if(cb)
        {
            if(!url || !method){
                return cb(new Error('please Enter url and method'));
            }
            Requester({method,myUrl:url,contentType,content,headers},cb);   
        }
    else{
        return new Promise((resolve,reject)=>{
            Requester({method,myUrl:url,contentType,content,headers},(err,res)=>{
                if(err)
                    return reject(err);
                resolve(res);
            });
        });
    }
}

nore.get=(url,headers,cb)=>{
    if(cb){
        if(!url)
            return cb('PLEASE ENTER URL');
        Requester({method:"GET",myUrl:url,headers},cb);
    }else{
        return new Promise((resolve,reject)=>{
            if(!url)
                return reject('PLEASE ENTER URL');
            Requester({method:"GET",myUrl:url,headers},(err,res)=>{
                if(err)
                    return reject(err);
                resolve(res);
            });
        });
    }
    
}

nore.post=(url,contentType,content,headers,cb)=>{
    if(cb){
        if(!url) return cb('PLEASE ENTER URL');
        Requester({method:"POST",myUrl:url,contentType,content,headers},cb);
    }else{
        return new Promise((resolve,reject)=>{
            if(!url) return reject('PLEASE ENTER URL');
            Requester({method:"POST",myUrl:url,contentType,content,headers},(err,res)=>{
                if(err) return reject(err);
                resolve(res);
            });
        });
    }

}

nore.head=(url,headers,cb)=>{
    if(cb){
        if(!url) return cb('PLEASE ENTER URL');
        Requester({method:"HEAD",myUrl:url,headers},cb);
    }else{
        return new Promise((resolve,reject)=>{
            if(!url) return reject('PLEASE ENTER URL');
            Requester({method:"HEAD",myUrl:url,headers},(err,res)=>{
                if(err) return reject(err);
                resolve(res);
            });
        });
    }
    
}

nore.put=(url,contentType,content,headers,cb)=>{
    if(cb){
        if(!url) return cb('PLEASE ENTER URL');
        Requester({method:"PUT",myUrl:url,content,contentType,headers},cb);
    }else{
        return new Promise((resolve,reject)=>{
            if(!url) return reject('PLEASE ENTER URL');
            Requester({method:"PUT",myUrl:url,content,contentType,headers},(err,res)=>{
                if(err) return reject(err);
                resolve(res);
            });
        });
    }
}

nore.delete=(url,contentType,content,headers,cb)=>{
    if(cb){
        if(!url) return cb('PLEASE ENTER URL');
        Requester({method:'DELETE',myUrl:url,content,contentType,headers},cb);
    }else{
        return new Promise((resolve,reject)=>{
            if(!url) return reject('PLEASE ENTER URL');
            Requester({method:'DELETE',myUrl:url,content,contentType,headers},(err,res)=>{
                if(err) return reject(err);
                resolve(res);
            });
        });
    }
}


module.exports=nore;