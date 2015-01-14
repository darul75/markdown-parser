// test/main.js
var parser = require('../src/markdown-parser');
var assert = require("assert");

describe('tests', function() {
    describe('with header', function() {
        it('return Netherlands nice country', function(done) {
            parser.parse("#header1 \n#header2", function(err, result) {                
                assert.equal(result.headings.length, 2);
                done();
            });
        });
    });
});