module.exports = function (window, session, request, response) {
  var key = request.getChunk(5);
  return window.localStorage.getItem(key);
};