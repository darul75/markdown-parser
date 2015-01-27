// node http api
// pegjs  -e markdownparser markdown-grammar.pegjs parser-browser.js
// pegjs markdown-grammar.pegjs parser.js
var pegparser = require('./parser.js');

function MardownParser() {
  this.init();
}

MardownParser.prototype.init = function() {
  return this;
};

MardownParser.prototype.parse = function(markdown, next) {
  var result = pegparser.parse(markdown);
  return process.nextTick(function() {
    next(null, result);
  });  
};

var parser = new MardownParser();
module.exports = parser;