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
      assert.equal('undefined', parser.parser({
        url: 'http://www.newyorker.com/online/blogs/johncassidy/2013/11/iran-nuke-deal-do-economic-sanctions-work-after-all.html',
        token: token
      }, function(result){
        return typeof result;
      }));
    });
  });
});
