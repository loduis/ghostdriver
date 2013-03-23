module.exports = function(window, session, request, response) {
  var result = window.eval(
    'execute_script',
    'return arguments[0].tagName.toLowerCase()',
    [request.getElement()]
  );
  response.basedOnResult(result, session, request);
};