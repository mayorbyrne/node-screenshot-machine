var should = require('should'),
  uploadStream;

describe('Screenshot Machine', function() {

  describe('get', function() {
    var results,
      ssm = require('../')({
        key: '12345',
        request: require('./mocks/request')()
      });

    describe('when uploadStream provided', function() {

      before(function(done) {
        uploadStream = require('./mocks/uploadStream')();
        uploadStream.once('testChunk', function(chunkData) {
          chunkData.should.equal('test readable stream data');
        });

        ssm.get({
            url: 'www.test.com',
            uploadStream: uploadStream
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

      describe('when no upstream provided', function() {

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
});