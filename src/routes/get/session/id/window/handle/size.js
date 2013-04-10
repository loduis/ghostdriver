module.exports = function (window, session, request, response) {
  response.success(session.getId(), window.getSize());
};