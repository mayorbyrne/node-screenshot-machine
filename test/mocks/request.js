var util = require('util');
var Readable = require('readable-stream').Readable;

function RequestStreamSuccess(options) {
  var self = this;
  options = options || {};
  options.encoding = 'utf8';
  this.statusCode = 200;
  this.headers = {
    'content-description': 'File Transfer',
    'content-transfer-encoding': 'binary',
    'content-length': '63270',
    'content-type': 'image/png'
  };
  this.chunkData = [
    'test readable stream data',
    null
  ];
  this.counter = 0;
  Readable.call(this, options);
  setTimeout(function () {
    self.emit('response', self);
  }, 100);
}

function RequestStreamFail(options) {
  var self = this;
  this.headers = {
    'x-screenshotmachine-response': 'invalid_url'
  };
  setTimeout(function () {
    self.emit('response', self);
  }, 100);
}

util.inherits(RequestStreamSuccess, Readable);
util.inherits(RequestStreamFail, Readable);

RequestStreamSuccess.prototype._read = function _read(size) {
  this.push(this.chunkData[this.counter]);
  this.counter++;
};

function Request(options) {}

Request.prototype.get = function get(options) {
  if (options.url.substring(options.url.length - 4, options.url.length) === 'fail') {
    return new RequestStreamFail();
  }
  return new RequestStreamSuccess();
};

module.exports = exports = function requestFactory(options) {
  return new Request(options);
};
