module.exports.default = async (event, context) => {
  console.log(
    'Logger',
    JSON.stringify(
      {
        event,
        context,
      },
      null,
      2,
    ),
  );
  return {
    newEvent: true,
  };
};
