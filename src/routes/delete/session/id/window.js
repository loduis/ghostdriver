module.exports = function (window, session, request, response) {
  window.close();
  response.success(session.getId());
};