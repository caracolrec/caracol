var assert = require('assert');
var expect = require('chai').expect;
var http = require('http');
var superagent = require('superagent');
var path = require('path');
var parser = require('../routes/parser');
var token = process.env.APPSETTING_readability_key || require('../config/config.js').token;

var host = 'localhost';
var port = 3000;

describe('express server', function() {

  var user_id = 1;
  var lastId = 0;
  var batchSize = 10;
  // currently assuming user is authenticated
  it('should respond to GET /fetchmyclippings with clippings from the db', function(done) {
    superagent.get('http://' + host + ':' + port + '/fetchmyclippings?user_id=' + user_id + '&lastId=' + lastId + '&batchSize=' + batchSize)
    .end(function(error, res) {
      expect(error).to.eql(null);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.below(batchSize + 1);
      done();
    });
  });

  // currently assuming user is authenticated
  it('should respond to GET /fetchmyrecommendations with recs from the db', function(done) {
    superagent.get('http://' + host + ':' + port + '/fetchmyclippings?user_id=' + user_id + '&lastId=' + lastId + '&batchSize=' + batchSize)
    .end(function(error, res) {
      expect(error).to.eql(null);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.below(batchSize + 1);
      done();
    });
  });

  var url = 'http://www.nytimes.com/2013/12/06/world/africa/nelson-mandela_obit.html';
  it('should respond to POST /uri by returning id of the clipping that was saved to the db', function(done) {
    superagent.post('http://' + host + ':' + port + '/uri?uri=' + url + '&user_id=' + user_id)
    .end(function(error, res) {
      console.log(res);
      expect(error).to.eql(null);
      expect(res.status).to.eql(200);
      expect(parseInt(res.text)).to.be.a('number');
      done();
    });
  });

});
