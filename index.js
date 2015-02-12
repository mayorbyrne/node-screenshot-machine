var qs = require('querystring'),
  Promise = require('bluebird');

function Screenshotmachine(config) {
  config = config || {};
  if (!config.key) {
    throw new Error('Screenshotmachine Key required');
  }

  this.request = config.request || require('request');
  this.baseUrl = 'http://api.screenshotmachine.com/?';
  this.key = config.key;

  this.options = {
    key: config.key,
    size: config.size,
    format: config.format,
    hash: config.hash,
    cacheLimit: config.cacheLimit,
    timeout: config.timeout
  }
}

/**
 * Generate the querystring'd url to request screenshot
 *
 * @param {Object} options the options object from get()
 * @returns {String} url with appropriate options attached as a querystring
 */
Screenshotmachine.prototype.generateUrl = function generateUrl(options) {
  options = options || {};

  if (!options.url) {
    throw new Error('Url required');
  }

  var screenshotMachineOptions = {
    key: this.key,
    url: options.url
  };

  var size = options.size || this.options.size,
    format = options.format || this.options.format,
    hash = options.hash || this.options.hash,
    cacheLimit = (options.cacheLimit || options.cacheLimit === 0) ? options.cacheLimit : this.options.cacheLimit,
    timeout = (options.timeout || options.timeout === 0) ? options.timeout : this.options.timeout;

  if (size) {
    screenshotMachineOptions.size = size;
  }
  if (format) {
    screenshotMachineOptions.format = format;
  }
  if (hash) {
    screenshotMachineOptions.hash = hash;
  }
  if (cacheLimit || cacheLimit === 0) {
    screenshotMachineOptions.cacheLimit = cacheLimit;
  }
  if (timeout || timeout === 0) {
    screenshotMachineOptions.timeout = timeout;
  }

  return this.baseUrl + qs.stringify(screenshotMachineOptions);
}

/**
 * Get a screenshot from screenshotmachine
 *
 * @param {Object} options
 * @param {String} options.url Url of the site to capture screenshot for.  http(s)://
 *   protocol is optional
 * @param {String} [options.size = 'T'] Size of the screenshot you would like to capture.
 *   'T', 'S', 'E', 'N', 'M', 'L', 'X', 'F', 'Nmob', 'Fmob'
 * @param {String} [options.format = 'JPG'] Format the screenshot should save as
 *   'JPG', 'GIF', or 'PNG'
 * @param {String} [options.hash] Used to safeguard your account, if specified.  The hash
 *   value is calculated using an MD5 algorithm from the options.url value and the account's
 *   secret phrase.
 * @param {Number} [options.cacheLimit = 14] Number of days to cache an image before requesting a new one.
 *   Can be any number from 0 - 14
 * @param {Number} [options.timeout = 200] Number of ms to wait before the screenshot is collected.
 *   Can choose from 0, 200, 400, 600, 800, or 1000
 * @param {Object} [options.writeStream] An writeStream object, capable of receiving piped input.
 *   If provided, will pipe the response directly to the provided stream before returning the response
 *   to the callback/promise.
 *
 * @returns {Promise/Function} done callback/promise.  If writeStream is provided, will return the
 *   details from the upload, otherwise will return a JSON representation of the response from
 *   screenshotmachine.
 */
Screenshotmachine.prototype.get = function get(options, done) {
  var self = this;

  if (typeof options === 'string') {
    options = {
      url: options
    }
  }

  options = options || {};

  if (!options.url) {
    return Promise.reject('Url required').nodeify(done);
  }

  return new Promise(function(resolve, reject) {
    self.request
      .get({
        url: self.generateUrl(options)
      })
      .once('error', function(err) {
        reject(err);
      })
      .once('response', function(response) {
        // Screenshot machine errors are returned in this header.
        // https://screenshotmachine.com/apiguide.php
        if (response.headers['x-screenshotmachine-response']) {
          reject(response.headers['x-screenshotmachine-response']);
        }
        else if (options.writeStream) {
          response.pipe(options.writeStream);
          options.writeStream.on('error', function(err) {
            reject(err);
          });

          options.writeStream.once('finish', function() {
            resolve(response);
          });
        }
        else {
          resolve(response);
        }
      });
  }).nodeify(done);
}

module.exports = exports = function(options) {
  return new Screenshotmachine(options);
};
