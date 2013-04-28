module.exports = function () {
  var fs = null;
  return function (window, session, request, response) {
    var id      = window.activeElement(),
        element = new window.Element(id),
        value   = request.getParam('value');
    if (value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else {
      var tagName = element.getTagName(),
          type = element.getAttribute('type');
          value = value.join(''),
          timeout = session.getPageLoadTimeout();
      fs = fs || require('fs');

      if (tagName === 'input' && type &&
                          type.toLowerCase() === 'file' && fs.exists(value)) {
        element.on('filePicker', function () {
          return value;
        });
        element.click().wait(timeout, function (status, result) {
          response.basedOnResult(result, session, request);
        });
      } else {
        element.sendKeys(value).wait(timeout, function (status, result) {
          window.keyboard.clearModifiers();
          response.basedOnResult(
            result,
            session,
            request
          );
        });
      }
    }
  };
}();