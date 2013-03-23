module.exports = function(window, session, request, response) {
  var result = window.eval('active_element');
  response.basedOnResult(result, session, request);
};