

module.exports.default = (decoded, context) => {
  console.log('decodedToken', decoded);
  return {
    message: 'If you see me it means the the wrapped function allowed it',
  };
}