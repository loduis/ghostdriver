module.exports = function (window, session, request, response) {
  var result = window.eval('clear_local_storage');
  response.basedOnResult(result, session, request);
};