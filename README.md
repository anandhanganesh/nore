## POSTKARAN-REQUEST (Version : BETA-0.0.1)

Simplified [node](http://nodejs.org) HTTP/HTTPS Requester built using native node modules.

## Installation 

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

```bash
$ npm i postkaran-request
```

## Usage

### Include

```js
var postKaran = require('postkaran-request');
```
### Simple Usage

```js
postKaran(method,url,contentType,content,headers).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
});
```

### Usage With Promise

```js
postKaran.get(url,headers).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});
```

### Usage With Callback

```js
postKaran.post(url,contentType,content,headers,(err,res) => {
    if(err)
        console.log(err);
    else
        console.log(res);
});
```

## Example:

```js
postKaran('GET','https://www.google.com','text/plain','',{},(err,res) => {
    if(err)
        console.log(err);
    else
        console.log(res);
});
```

## Request

### Methods

- get
- post
- delete
- put
- head

### url 

http(s)://example.com

### contentType

- 'application/json',
- 'application/x-www-form-urlencoded',
- 'multipart/form-data',
- 'text/plain'

### content
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


## Response
- data - response data,
- cookies - response cookies,
- headers - response headers,
- statusCode - status code sent from server,
- status - status sent from server,
- viewable - says data is viewable or not,
- fileExtension - says the type of data is return for 'text/html' fileExtension-'html'

