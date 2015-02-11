var util = require('util'),
  EventEmitter = require('events').EventEmitter;
var Writable = require('readable-stream').Writable;

function UploadStream(options) {
  var self = this;
  options = options || {};
  options.decodeStrings = false;
  Writable.call(this, options);
}

util.inherits(UploadStream, Writable);

UploadStream.prototype._write = function(chunk, encoding, done) {
  this.emit('testChunk', chunk);
  done(null);
};

module.exports = exports = function UploadStreamFactory(options) {
  return new UploadStream(options);
};