const path = require('path');
const engine = require('../engine');

const template = require('./templates');

const DIR_TO_DOT = /\//g;

const python = engine({
  runtimeRegex: /python.*/gi,
  suffix: 'py',
  resolvePaths: (file) => {
    const result = path.normalize(file).split('.');
    return [result[0].replace(DIR_TO_DOT, '.'), result[1]];
  },
});

module.exports = {
  ...python,
  createTemplate: ({ before, after, handler }) => {
    const resolved = {
      before: python.resolve(before),
      after: python.resolve(after),
      handler: python.resolve(handler),
    };

    return python.compile(template, {
      flow: python.createCodeFlowKey(resolved),
      ...resolved,
    });
  },
};
