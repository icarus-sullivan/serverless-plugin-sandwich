
const before = require('../lambdas/wrapped/pre').default;
const handler = require('../lambdas/wrapped/handler').default;
const after = require('../lambdas/wrapped/post').default;

module.exports.default = async (event, context) => {


  const response = await before(async (e, c) => after(await handler(e, c)))(event, context);









  return response;
};
