module.exports = function (window, session, request, response) {
  var cookieName = request.getChunk(4);
  window.deleteCookie(cookieName);
  response.success(session.getId());
};