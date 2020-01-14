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
  {{#if before.inline}}
  await before(event, context);
  {{/if}}

  {{#if (and after.pipe before.pipe)}}
  const response = await after(await handler(await before(event, context)));
  {{/if}}

  {{#if (and after.pipe before.wrap)}}
  const response = await before(async (e, c) => after(await handler(e, c)))(event, context);
  {{/if}}

  {{#if (and after.pipe before.inline)}}
  const resonse = await after(await handler(event, context));
  {{/if}}

  {{#if (and after.wrap before.wrap)}}
  const response = await before(await handler(after))(event, context);
  {{/if}}

  {{#if (and after.wrap before.pipe)}}
  const response = await after(async (e, c) => handler(await before(e, c)))(event, context);
  {{/if}}

  {{#if (and after.wrap before.inline)}}
  const response = await after(await handler(event, context));
  {{/if}}

  {{#if (and after.inline before.inline )}}
  const response = await handler(event, context);
  {{/if}}

  {{#if (and after.inline before.wrap)}}
  const response = await before(handler)(event, context); 
  {{/if}}

  {{#if (and after.inline before.pipe)}}
  const response = await handler(await before(event, context));
  {{/if}}

  {{#if after.inline}}
  await after(event, context);
  {{/if}}

  return response;
};
`;
