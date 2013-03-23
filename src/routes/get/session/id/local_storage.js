module.exports = function (window, session, request, response) {
  var result = window.eval('get_local_storage_keys');
  response.basedOnResult(result, session, request);
};