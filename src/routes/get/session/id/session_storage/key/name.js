module.exports = function (window, session, request, response) {
  var key = request.getChunk(5);
  return window.sessionStorage.getItem(key);
};