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
}

/**
 * Generate the querystring'd url to request screenshot
 *
 * @param {Object} options the options object from get()
 * @returns {String} url with appropriate options attached as a querystring
 */
Screenshotmachine.prototype.generateUrl = function generateUrl(options) {
  var screenshotMachineOptions = {
    key: this.key,
    url: options.url
  };

  if (options.size) {
    screenshotMachineOptions.size = options.size;
  }

  if (options.format) {
    screenshotMachineOptions.format = options.format;
  }

  if (options.hash) {
    screenshotMachineOptions.hash = options.hash;
  }

  if (options.cache) {
    screenshotMachineOptions.cacheLimit = options.cache;
  }

  if (options.timeout) {
    screenshotMachineOptions.timeout = options.timeout;
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
 * @param {Number} [options.cache = 14] Number of days to cache an image before requesting a new one.
 *   Can be any number from 0 - 14
 * @param {Number} [options.timeout = 200] Number of ms to wait before the screenshot is collected.
 *   Can choose from 0, 200, 400, 600, 800, or 1000
 * @param {Object} [options.uploadStream] An uploadStream object, capable of receiving piped input.
 *   If provided, will pipe the response directly to the upload stream before returning the upload
 *   results to the callback/promise.
 *
 * @returns {Promise/Function} done callback/promise.  If uploadStream is provided, will return the
 *   details from the upload, otherwise will return a JSON representation of the response from
 *   screenshotmachine.
 */
Screenshotmachine.prototype.get = function get(options, done) {
  var self = this;
  options = options || {};

  if (!options.url){
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
        console.log(response);
        // Screenshot machine errors are returned in this header.
        // https://screenshotmachine.com/apiguide.php      
        if (response.headers['X-Screenshotmachine-Response']) {
          reject(response.headers['X-Screenshotmachine-Response']);
        } else if (options.uploadStream) {
          response.pipe(options.uploadStream);
          options.uploadStream.on('error', function(err) {
            reject(err);
          });

          options.uploadStream.once('uploaded', function(details) {
            resolve(details);
          });
        } else {
          resolve(response.toJSON());
        }
      });
  }).nodeify(done);
}

module.exports = exports = function(options) {
  options = options || {};
  return new Screenshotmachine(options);
};