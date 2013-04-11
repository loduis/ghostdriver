module.exports = function (request, response) {
  response.writeAndClose(
    200,
    'text/html;charset=UTF-8',
    '<html><body>Closing...</body></html>'
  );
};