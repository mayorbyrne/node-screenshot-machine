var util = require('util'),
  EventEmitter = require('events').EventEmitter;
var Writable = require('readable-stream').Writable;

function writeStream(options) {
  var self = this;
  options = options || {};
  options.decodeStrings = false;
  Writable.call(this, options);
}

util.inherits(writeStream, Writable);

writeStream.prototype._write = function (chunk, encoding, done) {
  this.emit('testChunk', chunk);
  done(null);
};

module.exports = exports = function writeStreamFactory(options) {
  return new writeStream(options);
};
