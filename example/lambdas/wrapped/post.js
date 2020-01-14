

module.exports.default = ({ message }, context) => ({
  statusCode: '200',
  body: JSON.stringify({
    message,
    response: 'post message',
  })
});