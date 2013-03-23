module.exports = function (window, session, request, response) {
  var result = window.eval('is_selected', request.getElement());
  response.basedOnResult(result, session, request);
};