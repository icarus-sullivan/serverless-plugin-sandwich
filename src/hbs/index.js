const NODE_RUNTIME = /node.*/gi;
const PYTHON_RUNTIME = /python.*/gi;

const createTemplateEngine = (runtime) => {
  if (NODE_RUNTIME.test(runtime)) {
    return require('./node');
  }

  if (PYTHON_RUNTIME.test(runtime)) {
    return require('./python');
  }

  throw new Error('Unsupported Runtime', runtime);
};

module.exports = { createTemplateEngine };
