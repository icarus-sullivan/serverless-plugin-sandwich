/* eslint-disable prefer-destructuring */
const handlebars = require('handlebars');
const path = require('path');

const WHITE_SPACE = /^\s+$/gm;
const FLOW_LOOKUP = ['inline', 'wrap', 'pipe'];

handlebars.registerHelper('flow', function(context, options) {
  if (options.data.root.flow === context) {
    return options.fn(this);
  }
});

const getOptionFlowKey = (option) =>
  FLOW_LOOKUP.reduce((a, k) => (option[k] ? k : a), 'inline');

module.exports = ({ runtimeRegex, resolvePaths, suffix }) => ({
  isRuntime: (runtime) => runtimeRegex.test(runtime),

  createFilename: ({ buildDir, name }) =>
    path.resolve(buildDir, `${name}.${suffix}`),

  createCodeFlowKey: ({ after, before }) =>
    [
      before && typeof before !== 'string' ? getOptionFlowKey(before) : 'na',
      after && typeof after !== 'string' ? getOptionFlowKey(after) : 'na',
    ].join('-'),

  compile: (template, context) =>
    handlebars
      .compile(template)(context)
      .replace(WHITE_SPACE, ''),

  resolve: (options) => {
    if (!options) return undefined;

    if (typeof options === 'string') {
      const [dir, name] = resolvePaths(options);
      return {
        inline: true,
        dir,
        name,
      };
    }

    const [dir, name] = resolvePaths(options.handler);
    return {
      inline: !options.wrap && !options.pipe,
      ...options,
      dir,
      name,
    };
  },
});
