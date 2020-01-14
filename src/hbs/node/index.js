const path = require('path');
const { compile } = require('../base');

const iterations = require('./iterations');

const WHITE_SPACE = /^\s+$/gm;

const resolve = (q) => {
  if (!q) return undefined;
  if (typeof q === 'string') {
    const resolved = path.normalize(q).split('.');
    return {
      dir: resolved[0],
      name: resolved[1],
      inline: true,
    };
  }
  const { handler, ...options } = q;
  const resolved = path.normalize(handler).split('.');
  return {
    dir: resolved[0],
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
  path.resolve(buildDir, `${name}.js`);

module.exports = {
  createFilename,
  createTemplate,
};
