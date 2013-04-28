module.exports = function (window, session, request, response) {
  var params = request.getParams();
  if (params.key === undefined) {
    response.error.missingCommandParameter('key', request);
  } else if(params.value === undefined) {
    response.error.missingCommandParameter('value', request);
  } else {
    response.basedOnResult(
      window.localStorage.setItem(params.key, params.value),
      session,
      request
    );
  }
};