// test/main.js
var parser = require('../src/markdown-parser');
var assert = require("assert");

describe('tests', function() {
  describe('parsing', function() {
    it('bold', function(done) {
        parser.parse("**b** __b__", function(err, result) {                
            assert.equal(result.bolds.length, 2);
            done();
        });
    });
    it('headings', function(done) {
        parser.parse("#header1 \n#header2", function(err, result) {                
            assert.equal(result.headings.length, 2);
            done();
        });
    });
    it('italics', function(done) {
        parser.parse("*iiiii*\nother\n\n *iiiii*", function(err, result) {                
            assert.equal(result.italics.length, 2);
            done();
        });
    });
    it('list', function(done) {
        parser.parse("- item1 \n- item2 \nother\n*item1\nitem2", function(err, result) {                
            assert.equal(result.lists[0].length, 2);
            done();
        });
    });      
    it('headings', function(done) {
        parser.parse("#header1 \n#header2", function(err, result) {                
            assert.equal(result.headings.length, 2);
            done();
        });
    });
  });
});