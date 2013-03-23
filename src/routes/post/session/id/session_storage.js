module.exports = function (window, session, request, response) {
  var params = request.getParams();
  if (params.key === undefined) {
    response.error.missingCommandParameter('key', request);
  } else if(params.value === undefined) {
    response.error.missingCommandParameter('value', request);
  } else {
    var result = window.eval(
      'set_session_storage_item',
      params.key,
      params.value
    );
    response.basedOnResult(result, session, request);
  }
};