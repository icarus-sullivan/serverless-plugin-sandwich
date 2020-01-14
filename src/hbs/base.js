const handlebars = require('handlebars');

handlebars.registerHelper({
  and() {
    return Array.prototype.slice.call(arguments).every(Boolean);
  },
});

module.exports = { compile: handlebars.compile.bind(handlebars) };
