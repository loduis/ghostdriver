module.exports = function (window, session, request, response) {
  var locator = request.getParams();
  if (locator.using === undefined) {
    response.error.missingCommandParameter('using', request);
  } else if (locator.value === undefined) {
    response.error.missingCommandParameter('value', request);
  } else {
    var time    = session.getImplicitTimeout();
    window.find(locator).wait(time, function (result) {
      console.log(JSON.stringify(result));
      if (result.value === null) {
        result.status = response.error.NO_SUCH_ELEMENT;
        result.value = {message: 'No Such Element found'};
      } else if (result.status !== 0 &&
          result.value.message.indexOf('SYNTAX_ERR: DOM Exception 12') !== -1) {
        result.status = response.error.INVALID_SELECTOR;
      }
      response.basedOnResult(result, session, request);
    });
  }
};