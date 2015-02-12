var should = require('should'),
  writeStream;

describe('Screenshot Machine', function() {

  describe('.generateUrl()', function(){
    var baseUrl = 'http://api.screenshotmachine.com/?',
    ssm = require('../')({
      key: '123456'
    });

    it('called with no options should throw error', function(){
      ssm.generateUrl.bind(ssm).should.throw('Url required');
    });

    describe('called with url', function(){
      it('should return the baseUrl with key & url', function(){
        ssm.generateUrl({
          url: 'www.test.com'
        }).should.equal(baseUrl + 'key=123456&url=www.test.com');
      }); 
    });

    describe('called with size', function(){
      it('should return the baseUrl with key, url & size', function(){
        ssm.generateUrl({
          url: 'www.test.com',
          size: 'F'
        }).should.equal(baseUrl + 'key=123456&url=www.test.com&size=F');
      });
    });

    describe('called with format', function(){
      it('should return the baseUrl with key, url & format', function(){
        ssm.generateUrl({
          url: 'www.test.com',
          format: 'PNG'
        }).should.equal(baseUrl + 'key=123456&url=www.test.com&format=PNG');
      });
    });

    describe('called with hash', function(){
      it('should return the baseUrl with key, url & hash', function(){
        ssm.generateUrl({
          url: 'www.test.com',
          hash: 'x6c6x7s6'
        }).should.equal(baseUrl + 'key=123456&url=www.test.com&hash=x6c6x7s6');
      });
    });

    describe('called with cacheLimit', function(){
      it('should return the baseUrl with key, url & cacheLimit', function(){
        ssm.generateUrl({
          url: 'www.test.com',
          cacheLimit: 0
        }).should.equal(baseUrl + 'key=123456&url=www.test.com&cacheLimit=0');
      });
    });

    describe('called with timeout', function(){
      it('should return the baseUrl with key, url & timeout', function(){
        ssm.generateUrl({
          url: 'www.test.com',
          timeout: 0
        }).should.equal(baseUrl + 'key=123456&url=www.test.com&timeout=0');
      });
    });

    describe('called with multiple options', function(){
      it('should return the baseUrl with all options specified', function(){
        ssm.generateUrl({
          url: 'www.test.com',
          hash: '12345',
          size: 'F',
          format: 'PNG',
          cacheLimit: 0,
          timeout: 0
        }).should.equal(baseUrl + 'key=123456&url=www.test.com&size=F&format=PNG&hash=12345&cacheLimit=0&timeout=0');
      });
    });          

  });

  describe('.get()', function() {
    var results,
      ssm = require('../')({
        key: '12345',
        request: require('./mocks/request')()
      });

    describe('when writeStream is provided', function() {

      before(function(done) {
        writeStream = require('./mocks/writeStream')();
        writeStream.once('testChunk', function(chunkData) {
          chunkData.should.equal('test readable stream data');
        });

        ssm.get({
            url: 'www.test.com',
            writeStream: writeStream
          })
          .then(function(data) {
            results = data;
            done();
          });
      });

      it('results should have a statusCode of 200', function() {
        results.statusCode.should.equal(200);
      });

      it('results should return the correct headers', function() {
        results.headers['content-type'].should.equal('image/png');
        results.headers['content-description'].should.equal('File Transfer');
        results.headers['content-transfer-encoding'].should.equal('binary');
        results.headers['content-length'].should.equal('63270');
      });
    });

      describe('when no writeStream is provided', function() {

        before(function(done) {
          ssm.get({
              url: 'www.test.com'
            })
            .then(function(data) {
              results = data;
              done();
            });
        });

        it('results should have a statusCode of 200', function() {
          results.statusCode.should.equal(200);
        });

        it('results should return the correct headers', function() {
          results.headers['content-type'].should.equal('image/png');
          results.headers['content-description'].should.equal('File Transfer');
          results.headers['content-transfer-encoding'].should.equal('binary');
          results.headers['content-length'].should.equal('63270');
        });

      });

      describe('when screenshotmachine returns an error', function() {

        before(function(done) {
          ssm.get({
              url: 'fail'
            })
            .catch(function(err) {
              results = err;
              done();
            })
        });

        it('err should exist and be "invalid_url"', function() {
          results.should.equal('invalid_url');
        });

        describe('callback style', function() {
          before(function(done) {
            ssm.get({
              url: 'fail'
            }, function(err, data) {
              results = err;
              done();
            });
          });

          it('err should exist and be "invalid_url"', function() {
            results.should.equal('invalid_url');
          });
        });
      });
  });
});