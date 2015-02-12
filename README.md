# node-screenshot-machine

Simple node.js wrapper for [Screenshot Machine](http://www.screenshotmachine.com/)'s API.

## API

Screenshot Machine provides a very simple url-based [API](http://www.screenshotmachine.com/apiguide.php), with config options passed as optional url params. This library provides a convenient, node-ish wrapper that makes using Screenshot Machine in your node app a snap.

## Installation

Run `npm install node-screenshot-machine`

or `git clone` then `npm install`

Optionally run unit tests: `npm test`

## Setup

Initializing the node-screenshot-machine module is simple:

```js
var screenshot = require('node-screenshot-machine')({
  key: ***** // your screenshotmachine API key
});
```

## Capture

Capturing a website screenshot is also simple:

`screenshot.get(options, callback)`

The module handles standard callback-style invocation:

```js
screenshot.get({
  url: 'www.test.com'
},
function(err, result){
  if (err) {
    // handle error
  }
  // handle result
});
```

as well as [promise](https://github.com/petkaantonov/bluebird)-style:

```js
screenshot.get({
  url: 'www.test.com'
})
.then(function(result){
  // handle result
})
.catch(function(err){
  // handle error
});
```

### Options

Complete details can be found in Screenshot Machine's [API guide](https://www.screenshotmachine.com/apiguide.php).

**Required Fields**

- **url**: the web page to capture a screenshot for

**Optional Fields**

- **size**: Captured image size (defaults to 'T' - 120 x 90px)
- **format**: Image file format (defaults to 'JPG')
- **hash**: MD5 hash used for security purposes when called from a web page (defaults to blank)
- **cacheLimit**: How many days to allow images from cache (defaults to 14 days)
- **timeout**: Capture timeout (defaults to 200ms)

### Streaming

Note that the `screenshot.get` method optionally supports streaming the captured image directly to any [writable stream](http://nodejs.org/api/stream.html#stream_class_stream_writable) using the optional `writeStream` field:

```js
var siteImage = require('fs').createWriteStream('siteImage.png');

screenshot.get({
  url: 'www.someurl.com',
  format: 'PNG',
  writeStream: file
});
```

## License

**MIT**

Copyright &copy; 2015 Level Seven

## Contributors

- [Kevin Moritz](https://github.com/ecorkevin)
- [Brian Moeskau](https://github.com/bmoeskau)
- [Todd Bluhm](https://github.com/toddbluhm)
