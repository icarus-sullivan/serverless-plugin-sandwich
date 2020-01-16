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
  const response = await handler(event, context);
  {{/flow}}

  {{#flow 'inline-inline'}}
  await before(event, context);
  const response = await handler(event, context);
  await after(event, context);
  {{/flow}}

  {{#flow 'inline-wrap'}}
  await before(event, context);
  const response = await handler(after)(event, context);
  {{/flow}}

  {{#flow 'inline-pipe'}}
  await before(event, context);
  const response = await after(await handler(event, context));
  {{/flow}}

  {{#flow 'pipe-na'}}
  const response = await handler(await before(event, context));
  {{/flow}}

  {{#flow 'pipe-inline'}}
  const response = await handler(await before(event, context));
  await after(event, context);
  {{/flow}}

  {{#flow 'pipe-pipe'}}
  const response = await after(await handler(await before(event, context)));
  {{/flow}}

  {{#flow 'pipe-wrap'}}
  const response = await handler(after)(await before(event, context));
  {{/flow}}

  {{#flow 'na-na'}}
  const response = await handler(event, context);
  {{/flow}}

  {{#flow 'na-inline'}}
  const response = await handler(event, context);
  await after(event, context);
  {{/flow}}

  {{#flow 'na-pipe'}}
  const response = await after(await handler(event, context));
  {{/flow}}

  {{#flow 'na-wrap'}}
  const response = await handler(after)(event, context);
  {{/flow}}

  {{#flow 'wrap-na'}}
  const response = await before(handler)(event, context);
  {{/flow}}

  {{#flow 'wrap-inline'}}
  const response = await before(handler)(event, context);
  await after(event, context);
  {{/flow}}

  {{#flow 'wrap-pipe'}}
  const response = await after(await before(handler)(event, context));
  {{/flow}}

  {{#flow 'wrap-wrap'}}
  const response = await before(handler(after))(event, context);
  {{/flow}}

  return response;
};
`;
