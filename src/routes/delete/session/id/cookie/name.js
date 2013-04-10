module.exports = function (window, session, request, response) {
  var cookieName = request.getChunk(4);
  window.cookie.remove(cookieName);
  response.success(session.getId());
};