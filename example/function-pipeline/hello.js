
const before = require('../lambdas/ordered/pre').default;
const handler = require('../lambdas/ordered/handler').default;
const after = require('../lambdas/ordered/post').default;

module.exports.default = async (event, context) => {
  await before(event, context);






  const response = await after(await handler(event, context));





  return response;
};
