module.exports = function (window, session, request, response) {
  var result = window.eval('is_enabled', request.getElement());
  response.basedOnResult(result, session, request);
};