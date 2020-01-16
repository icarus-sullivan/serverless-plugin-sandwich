const path = require('path');
const engine = require('../engine');

const template = require('./templates');

const node = engine({
  runtimeRegex: /node.*/gi,
  suffix: 'js',
  resolvePaths: (file) => path.normalize(file).split('.'),
});

module.exports = {
  ...node,
  createTemplate: ({ before, after, handler }) => {
    const resolved = {
      before: node.resolve(before),
      after: node.resolve(after),
      handler: node.resolve(handler),
    };

    return node.compile(template, {
      flow: node.createCodeFlowKey(resolved),
      ...resolved,
    });
  },
};
