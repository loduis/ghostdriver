module.exports = function (window, session, request, response) {
  var result = window.eval('get_local_storage_size');
  response.basedOnResult(result, session, request);
};