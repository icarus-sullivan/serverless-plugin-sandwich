const node = require('./node');
const PYTHON_RUNTIME = /python.*/gi;

const createTemplateEngine = (runtime) => {
  if (node.isRuntime(runtime)) {
    return node;
  }
  
  // WIP
  // if (PYTHON_RUNTIME.test(runtime)) {
  //   return require('./python');
  // }

  throw new Error('Unsupported Runtime', runtime);
};

module.exports = { createTemplateEngine };
