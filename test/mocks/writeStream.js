var util = require('util'),
  EventEmitter = require('events').EventEmitter;
var Writable = require('readable-stream').Writable;

function writableStream(options) {
  var self = this;
  options = options || {};
  options.decodeStrings = false;
  Writable.call(this, options);
}

util.inherits(writableStream, Writable);

writableStream.prototype._write = function(chunk, encoding, done) {
  this.emit('testChunk', chunk);
  done(null);
};

module.exports = exports = function writableStreamFactory(options) {
  return new writableStream(options);
};