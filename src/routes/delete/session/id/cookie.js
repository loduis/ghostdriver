module.exports = function (window, session, request, response) {
  window.cookie.clear();
  response.success(session.getId());
};