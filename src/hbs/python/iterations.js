module.exports = `
import sys
sys.path.append('../')
{{#with before}}
from {{dir}} import {{name}} as before
{{/with}}
{{#with handler}}
from {{dir}} import {{name}} as handler
{{/with}}
{{#with after}}
from {{dir}} import {{name}} as after
{{/with}}

async def default(event, context):
  {{#if before.inline}}
  await before(event, context)
  {{/if}}

  {{#if (and after.pipe before.pipe)}}
  response = await after(await handler(await before(event, context)))
  {{/if}}

  {{#if (and after.pipe before.wrap)}}
  response = await before(async (e, c) => after(await handler(e, c)))(event, context)
  {{/if}}

  {{#if (and after.pipe before.inline)}}
  resonse = await after(await handler(event, context))
  {{/if}}

  {{#if (and after.wrap before.wrap)}}
  response = await before(await handler(after))(event, context)
  {{/if}}

  {{#if (and after.wrap before.pipe)}}
  response = await after(async (e, c) => handler(await before(e, c)))(event, context)
  {{/if}}

  {{#if (and after.wrap before.inline)}}
  response = await after(await handler(event, context))
  {{/if}}

  {{#if (and after.inline before.inline )}}
  response = await handler(event, context)
  {{/if}}

  {{#if (and after.inline before.wrap)}}
  response = await before(handler)(event, context) 
  {{/if}}

  {{#if (and after.inline before.pipe)}}
  response = await handler(await before(event, context))
  {{/if}}

  {{#if after.inline}}
  await after(event, context)
  {{/if}}

  return response
`
