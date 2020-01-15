const path = require('path');
const { compile } = require('../base');

const iterations = require('./iterations');

const WHITE_SPACE = /^\s+$/gm;
const DIR_TO_DOT = /\//g;

const resolve = (q) => {
  if (!q) return undefined;
  if (typeof q === 'string') {
    const resolved = path.normalize(q).split('.');
    return {
      dir: resolved[0].replace(DIR_TO_DOT, '.'),
      name: resolved[1],
      inline: true,
    };
  }
  const { handler, ...options } = q;
  const resolved = path.normalize(handler).split('.');
  return {
    dir: resolved[0].replace(DIR_TO_DOT, '.'),
    name: resolved[1],
    ...options,
    inline: !options.wrap && !options.pipe,
  };
};

const createTemplate = ({ before, after, handler }) =>
  compile(iterations)({
    before: resolve(before),
    after: resolve(after),
    handler: resolve(handler),
  }).replace(WHITE_SPACE, '');

const createFilename = ({ buildDir, name }) =>
  path.resolve(buildDir, `${name}.py`);

module.exports = {
  createFilename,
  createTemplate,
};
