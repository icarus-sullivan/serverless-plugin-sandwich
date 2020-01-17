const node = require('./node');
const python = require('./python');

const createTemplateEngine = (runtime) => {
  if (node.isRuntime(runtime)) {
    return node;
  }

  if (python.isRuntime(runtime)) {
    return python;
  }

  throw new Error('Unsupported Runtime', runtime);
};

module.exports = { createTemplateEngine };
