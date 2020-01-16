const handlebars = require('handlebars');

handlebars.registerHelper({
  and() {
    return Array.prototype.slice.call(arguments).every(Boolean);
  },
  nand() {
    return !Array.prototype.slice.call(arguments).every(Boolean);
  },
  fns(a, b) {
    return a && !b;
  },
});

module.exports = handlebars;
