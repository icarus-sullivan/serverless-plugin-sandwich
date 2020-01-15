const jwt = require('jsonwebtoken');

const BEARER_REGEX = /bearer /gi;
const SALT = process.env.SALT || 'PEPPER';

module.exports.default = (handler) => async (event, context) => {
  try {
    const token = event.headers.Authorization.replace(BEARER_REGEX, '');
    const decoded = jwt.verify(token, SALT);
    return await handler(decoded);
  } catch (e) {
    return {
      statusCode: '401',
      body: 'Unauthorized',
    }
  }
}