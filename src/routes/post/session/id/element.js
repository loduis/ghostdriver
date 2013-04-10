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
    window.find(locator).wait(time, function (result) {
      var status = result.status;
      if (result.value === null) {
        result.status = response.error.NO_SUCH_ELEMENT;
        result.value = {message: 'No Such Element found'};
      } else if (status !== 0) {
        result.status = response.error.translateDomErrorCode(result.status);
      }
      response.basedOnResult(result, session, request);
    });
  }
};