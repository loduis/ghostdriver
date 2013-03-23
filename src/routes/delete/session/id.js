module.exports = function (session, request, response) {
  session.close();
  response.success(session.getId());
};