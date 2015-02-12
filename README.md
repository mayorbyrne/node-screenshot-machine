## node-screenshot-machine

1. [API](#api)
1. [Installing](#installing)
1. [Initializing node-screenshot-machine](#initializing-node-screens)
1. [Getting a Screenshot](#getting-a-screenshot)
1. [Options](#options)
1. [Saving a screenshot to a file](#saving-a-screenshot-to-a-)
1. [License](#license)
1. [See also](#see-also)

### <a id="node-screenshot-machine" href="#node-screenshot-machine">node-screenshot-machine</a>
Simple nodejs wrapper for [Screenshot Machine](http://www.screenshotmachine.com/)'s API.

### <a id="api" href="#api">API</a>

Screenshot Machine provides a very simple url-based [API](http://www.screenshotmachine.com/apiguide.php), with config options passed as optional url params. This library provides a convenient, node-ish wrapper that makes using Screenshot Machine in your node app a snap.

### <a id="installing" href="#installing">Installing</a>
To install, simply run ```npm install node-screenshot-machine```
or git clone this repo, and run ```npm install```

### <a id="initializing-node-screens" href="#initializing-node-screens">Initializing node-screenshot-machine</a>
Initializing the node-screenshot-machine module is simple:

```js
var screenshot = require('node-screenshot-machine')({
  key: ***** //your screenshotmachine key
});
```

### <a id="getting-a-screenshot" href="#getting-a-screenshot">Getting a Screenshot</a>
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

### <a id="options" href="#options">Options</a>

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

### <a id="saving-a-screenshot-to-a-" href="#saving-a-screenshot-to-a-">Saving a screenshot to a file</a>

If we want to save the screenshot to a file, we can do something like this:

```js
var file = require('fs').createWriteStream('example.png');

screenshot.get({
  format: 'PNG',
  url: 'www.someurl.com',
  uploadStream: file
})

```

example.png will then be similar to this:

```
950 4e47 0d0a 1a0a 0000 000d 4948 4452
0000 0400 0000 0494 0806 0000 00f9 ea7f
d600 0000 0970 4859 7300 000f 6100 000f
6101 a83f a769 0000 2000 4944 4154 789c
ecdd 6f8c 1ec7 7de0 f9ea 21e9 1c15 4b43
4bf2 6913 c922 0d78 6dd9 1b8b 9402 ac83
b368 527b 58ef 0670 42be cae1 0c1b a210
67ef c526 310d 6c76 0de4 004f 8235 b077
5e20 7436 7991 6c0e 1a21 8117 c81b 5197

....
....
....
```
### <a id="license" href="#license">License</a>

**MIT**

Copyright (c) 2015 Level Seven

### <a id="see-also" href="#see-also">See also</a>

External resources

* [Screenshot machine - www.screenshotmachine.com](http://www.screenshotmachine.com/)
* [Screenshot machine - API guide - www.screenshotmachine.com](https://www.screenshotmachine.com/apiguide.php)
