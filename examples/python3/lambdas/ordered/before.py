import json

def main(event, context):
  print('Logger', json.dumps({ 'event': event }, indent=2))

  return {
    'newEvent': True,
  }
