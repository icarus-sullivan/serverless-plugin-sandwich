module.exports = `
{{#with before}}
const before = require('../{{dir}}').{{name}};
{{/with}}
{{#with handler}}
const handler = require('../{{dir}}').{{name}};
{{/with}}
{{#with after}}
const after = require('../{{dir}}').{{name}};
{{/with}}

module.exports.default = async (event, context) => {
  {{#flow 'inline-na'}}
  await before(event, context);
  response = await handler(event, context);
  {{/flow}}

  {{#flow 'inline-inline'}}
  await before(event, context);
  response = await handler(event, context);
  await after(event, context);
  {{/flow}}

  {{#flow 'inline-wrap'}}
  await before(event, context);
  response = await handler(after)(event, context);
  {{/flow}}

  {{#flow 'inline-pipe'}}
  await before(event, context);
  response = await after(await handler(event, context));
  {{/flow}}

  {{#flow 'pipe-na'}}
  response = await handler(await before(event, context));
  {{/flow}}

  {{#flow 'pipe-inline'}}
  response = await handler(await before(event, context));
  await after(event, context);
  {{/flow}}

  {{#flow 'pipe-pipe'}}
  response = await after(await handler(await before(event, context)));
  {{/flow}}

  {{#flow 'pipe-wrap'}}
  response = await handler(after)(await before(event, context));
  {{/flow}}

  {{#flow 'na-na'}}
  response = await handler(event, context);
  {{/flow}}

  {{#flow 'na-inline'}}
  response = await handler(event, context);
  await after(event, context);
  {{/flow}}

  {{#flow 'na-pipe'}}
  response = await after(await handler(event, context));
  {{/flow}}

  {{#flow 'na-wrap'}}
  response = await handler(after)(event, context);
  {{/flow}}

  {{#flow 'wrap-na'}}
  response = await before(handler)(event, context);
  {{/flow}}

  {{#flow 'wrap-inline'}}
  response = await before(handler)(event, context);
  await after(event, context);
  {{/flow}}

  {{#flow 'wrap-pipe'}}
  response = await after(await before(handler)(event, context));
  {{/flow}}

  {{#flow 'wrap-wrap'}}
  response = await before(handler(after))(event, context);
  {{/flow}}

  return response;
};
`;
