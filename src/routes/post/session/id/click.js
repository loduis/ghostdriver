module.exports = function(window, session, request, response) {
  var button = request.getParam('button');
  button = button === undefined ? 0 : parseInt(button, 10);
  if (isNaN(button)) {
    response.error.missingCommandParameter('button', request);
  } else {
    /*
    var locator = {using: 'tagName', value: 'body'},
        time    = session.getImplicitTimeout();
    window.find(locator).wait(time, function (result) {
      var status = result.status;
      if (result.value === null) {
        result.status = response.error.NO_SUCH_ELEMENT;
        result.value = {message: 'No Such Element found'};
        response.basedOnResult(result, session, request);
      } else if (status !== 0) {
        result.status = response.error.translateDomErrorCode(result.status);
        response.basedOnResult(result, session, request);
      } else {
        var time = session.getPageLoadTimeout(),
            element = result.value;
        this.click(element, button).wait(time, function (status, result) {
          if (result) {
            response.basedOnResult(result, session, request);
          } else {
            response.success(session.getId());
          }
        });
      }
    });*/

    var time = session.getPageLoadTimeout();
    window.mouse.click(button).wait(time, function (status) {
      response.success(session.getId());
    });
  }
};