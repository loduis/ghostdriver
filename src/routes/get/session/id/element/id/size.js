module.exports = function (window, session, request, response) {
  var result = window.eval('get_size', request.getElement());
  response.basedOnResult(result, session, request);
};