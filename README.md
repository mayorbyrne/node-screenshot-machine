# node-screenshot-machine
Simple nodejs wrapper for [Screenshot Machine](http://www.screenshotmachine.com/)'s API.

## API

Screenshot Machine provides a very simple url-based [API](http://www.screenshotmachine.com/apiguide.php), with config options passed as optional url params. This library provides a convenient, node-ish wrapper that makes using Screenshot Machine in your node app a snap.

###Installing
To install, simply run ```npm install node-screenshot-machine```
or git clone this repo, and run ```npm install```

###Initializing node-screenshot-machine
Initializing the node-screenshot-machine module is simple:

```js
var screenshot = require('node-screenshot-machine')({
  key: ***** //your screenshotmachine key
});
```

###Getting a Screenshot 
```.get(options, callback)```

Now that we have initialized the node-screenshot-machine module, we can get
a screenshot.  The module handles promise-style as well as callback-style.

```js
screenshot.get({
  url: 'www.test.com',
  size: 'F',
  cache: 0,
  timeout: 0
}, function(err, data){
  // handle the callback
});
```

or

```js
screenshot.get({
  url: 'www.test.com'
})
.then(function(data){
  // handle data
})
.catch(function(err){
  // handle errors
});
```

Required fields:
- url (the site to capture screenshot for)

Options include (in more detail [here](https://www.screenshotmachine.com/apiguide.php):

*   size
*   cache
*   timeout
*   format
*   hash
*   timeout
*   uploadStream (You can also pass an upload stream in, if you would like to pipe the data directly to it with this option)

## License

**MIT**

Copyright (c) 2015 Level Seven