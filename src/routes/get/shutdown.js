module.exports = function (request, response) {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html;charset=UTF-8');
  response.writeAndClose('<html><body>Closing...</body></html>');
};