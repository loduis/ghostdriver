module.exports = function (window, session, request, response) {
  var key = request.getChunk(5);
  response.basedOnResult(
    window.sessionStorage.removeItem(key),
    session,
    request
  );
};