module.exports = function (window, session, request, response) {
  var result = window.eval(
        'get_attribute_value',
        request.getElement(),
        request.getChunk(6)
      );
    response.basedOnResult(result, session, request);
};