module.exports = function (window, session, request, response) {
  window.clearCookies();
  response.success(session.getId());
};