const get = require('lodash.get');

const pipe = (...fns) => (init) =>
  fns.reduce((current, fn) => {
    if (fn && current && current.then && typeof current.then === 'function') {
      return current.then(fn);
    }
    if (fn && typeof fn === 'function') {
      return fn(current);
    }
    return current;
  }, init);

module.exports = {
  pipe,
  get,
};
