module.exports = function (session, request, response) {
  response.success(session.close());
};