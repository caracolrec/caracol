//sample test
var assert = require('assert');
var expect = require('chai').expect;
var http = require('http');
var request = require('superagent');
var path = require('path');
var parser = require('../routes/parser');
var token = process.env.APPSETTING_readability_key || require('../config.js').token;

describe('GET', function(){
  describe('#parser()', function(){
    it('should return a parsed article', function(){
      
    });
  });
});
