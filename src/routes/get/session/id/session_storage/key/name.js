module.exports = function (window, session, request, response) {
  var result = window.eval('get_session_storage_item', request.getChunk(5));
  response.basedOnResult(result, session, request);
};