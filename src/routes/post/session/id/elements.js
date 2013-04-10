module.exports = function (window, session, request, response) {
  var locator = request.getParams();
  if (locator.using === undefined) {
    response.error.missingCommandParameter('using', request);
  } else if (locator.value === undefined) {
    response.error.missingCommandParameter('value', request);
  } else if (window.isInValidLocator(locator)) {
    response.error.unknownError(
      'Invalid locator received',
      session,
      request
    );
  } else {
    var time    = session.getImplicitTimeout();
    window.findAll(locator).wait(time, function (result) {
      if (result.status !== 0) {
        result.status = response.error.translateDomErrorCode(result.status);
      }
      response.basedOnResult(result, session, request);
    });
  }
};