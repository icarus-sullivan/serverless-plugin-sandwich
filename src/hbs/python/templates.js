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

def default(event, context):
  {{#flow 'inline-na'}}
  before(event, context)
  response = handler(event, context)
  {{/flow}}

  {{#flow 'inline-inline'}}
  before(event, context)
  response = handler(event, context)
  after(event, context)
  {{/flow}}

  {{#flow 'inline-wrap'}}
  before(event, context)
  response = handler(after)(event, context)
  {{/flow}}

  {{#flow 'inline-pipe'}}
  before(event, context)
  response = after(handler(event, context))
  {{/flow}}

  {{#flow 'pipe-na'}}
  response = handler(before(event, context))
  {{/flow}}

  {{#flow 'pipe-inline'}}
  response = handler(before(event, context))
  after(event, context)
  {{/flow}}

  {{#flow 'pipe-pipe'}}
  response = after(handler(before(event, context)))
  {{/flow}}

  {{#flow 'pipe-wrap'}}
  response = handler(after)(before(event, context))
  {{/flow}}

  {{#flow 'na-na'}}
  response = handler(event, context)
  {{/flow}}

  {{#flow 'na-inline'}}
  response = handler(event, context)
  after(event, context)
  {{/flow}}

  {{#flow 'na-pipe'}}
  response = after(handler(event, context))
  {{/flow}}

  {{#flow 'na-wrap'}}
  response = handler(after)(event, context)
  {{/flow}}

  {{#flow 'wrap-na'}}
  response = before(handler)(event, context)
  {{/flow}}

  {{#flow 'wrap-inline'}}
  response = before(handler)(event, context)
  after(event, context)
  {{/flow}}

  {{#flow 'wrap-pipe'}}
  response = after(before(handler)(event, context))
  {{/flow}}

  {{#flow 'wrap-wrap'}}
  response = before(handler(after))(event, context)
  {{/flow}}

  return response
`;
