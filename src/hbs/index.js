const node = require('./node');

const NODE_RUNTIME = /node.*/gi;
// eslint-disable-next-line no-unused-vars
const PYTHON_RUNTIME = /python.*/gi;

const createTemplateEngine = (runtime) => {
  if (NODE_RUNTIME.test(runtime)) {
    return node;
  }

  throw new Error('Unsupported Runtime', runtime);
};

module.exports = { createTemplateEngine };
