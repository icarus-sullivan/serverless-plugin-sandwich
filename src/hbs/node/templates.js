const WHITE_SPACE = /^\s+$/gm;

const main = `
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
{{#if (and before after)}}
  {{#if (and after.pipe before.pipe)}}
  const response = await after(await handler(await before(event, context)));
  {{/if}}

  {{#if (and after.pipe before.wrap)}}
  const response = await before(async (e, c) => after(await handler(e, c)))(
    event,
    context,
  );
  {{/if}}

  {{#if (and after.pipe before.inline)}}
  await before(event, context);
  const resonse = await after(await handler(event, context));
  {{/if}}

  {{#if (and after.wrap before.wrap)}}
  const response = await before(handler(after))(event, context);
  {{/if}}

  {{#if (and after.wrap before.pipe)}}
  const response = await after(async (e, c) => handler(await before(e, c)))(event, context);
  {{/if}}

  {{#if (and after.wrap before.inline)}}
  await before(event, context);
  const response = await handler(after)(event, context));
  {{/if}}

  {{#if (and after.inline before.inline)}}
  await before(event, context);
  const response = await handler(event, context);
  await after(event, context);
  {{/if}}

  {{#if (and after.inline before.wrap)}}
  const response = await before(handler)(event, context);
  await after(event, context);
  {{/if}}

  {{#if (and after.inline before.pipe)}}
  const response = await handler(await before(event, context));
  await after(event, context);
  {{/if}}

{{else if (fns before after)}}
  {{#if before.pipe}}
  const response = await handler(await before(event, context));
  {{else if before.wrap}}
  const response = await before(handler)(event, context);
  {{else}}
  await before(event, context);
  const response = await handler(event, context);
  {{/if}}

{{else if (fns after before)}}
  {{#if after.pipe}}
  const response = await after(await handler(event, context));
  {{else if after.wrap}}
  const response = await handler(after)(event, context);
  {{else}}
  const response = await handler(event, context);
  await after(event, context);
  {{/if}}

{{else if (nand after before)}}
  console.log('nonea fter befoe');
  const response = await handler(event, context);
{{/if}}

  return response;
};
`;

module.exports = (engine, context) =>
  engine
    .compile(main)(context)
    .replace(WHITE_SPACE, '');
