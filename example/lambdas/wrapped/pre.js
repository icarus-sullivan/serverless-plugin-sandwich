const jwt = require('jsonwebtoken');

const BEARER_REGEX = /bearer /gi;
const SALT = process.env.SALT || 'PEPPER';

// const generate = jwt.sign({
//   scope: ['foto:write', 'foto:read'],
//   clientId: '222-222-2222',
// }, SALT);

module.exports.default = (handler) => async (event, context) => {
  try {
    const token = event.headers.Authorization.replace(BEARER_REGEX, '');
    console.log('token', token);
    const decoded = jwt.verify(token, SALT);
    return await handler(decoded);
  } catch (e) {
    console.log(e.message);
    return {
      statusCode: '401',
      body: 'Unauthorized',
    }
  }
}