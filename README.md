## POSTKARAN-REQUEST (Version : BETA-0.0.1)

A SIMPLIFIED NODE HTTP/HTTPS REQUESTER USING NATIVE NODE MODULES
CAN BE USED ALL NODE AND NODE LIKE PROJECTS

## Installation 

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

```bash
$ npm i postkaran-request
```

# Usage

### Include

```js
var pk=require('postkaran-request');
```
### Simple Usage

```js
pk(method,url,contentType,content,headers).then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)
});
```

### Usage With Promise

```js
pk.get(url,headers).then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
});
```

### Usage With Callback

```js
pk.post(url,contentType,content,headers,(err,res)=>{
    if(err)
        console.log(err);
    else
        console.log(res);
});
```

## Example:

```js
pk('GET','https://www.google.com','text/plain','',{},(err,res)=>{
    if(err)
        console.log(err);
    else
        console.log(res);
});
```

## Allowed Postkaran Methods

- get
- post
- delete
- put
- head

method - HTTP METHODS i.e.,GET,POST,PUT,DELETE,HEAD
url -  Request Url
contentType- contentType of the content,
    allowed--> 
        'application/json',
        'application/x-www-form-urlencoded',
        'multipart/form-data',
        'text/plain'

content->Actual Content To Be Sent
    - json or json string for application/json
    - query or query string for application/x-www-form-urlencoded'
    - For multipart/form-data object must be sent in following manner
            {
                key1:{
                    value:path_to_file,
                    type:'file'
                },
                key2:{
                    value:'some value goes here',
                    type:'text'
                }
            }


response-->
    response actual contains the following values
        data- response data,
        cookies - response cookies,
        headers - response headers,
        statusCode - status code sent from server,
        status - status sent from server,
        viewable - says data is viewable or not,
        fileExtension - says the type of data is return for 'text/html' fileExtension-'html'

