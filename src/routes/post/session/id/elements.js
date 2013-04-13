module.exports = function (window, session, request, response) {
  var locator = request.getParams();
  if (locator.using === undefined) {
    response.error.missingCommandParameter('using', request);
  } else if (locator.value === undefined) {
    response.error.missingCommandParameter('value', request);
  } else {
    var time    = session.getImplicitTimeout();
    window.findAll(locator).wait(time, function (result) {
      response.basedOnResult(result, session, request);
    });
  }
};