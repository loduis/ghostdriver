module.exports = function (window, session, request, response) {
  var result = window.eval(
    'get_value_of_css_property',
    request.getElement(),
    request.getChunk(6)
  );
  response.basedOnResult(result, session, request);
};