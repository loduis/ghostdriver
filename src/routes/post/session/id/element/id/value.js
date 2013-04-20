var fs = null;
module.exports = function (element, session, request, response) {
  var value = request.getParam('value');
  if (value === undefined) {
    response.error.missingCommandParameter('value', request);
  } else {
    var tagName = element.getTagName(),
        type = element.getAttribute('type');
        value = value.join(''),
        timeout = session.getPageLoadTimeout();
    fs = fs || require('fs');

    if (tagName === 'input' && type && type.toLowerCase() === 'file' && fs.exists(value)) {
      element.on('filePicker', function () {
        return value;
      });
      element.click().wait(timeout, function (status, result) {
        response.basedOnResult(result, session, request);
      });
    } else {
      return element.sendKeys(value).wait(timeout, function (status, result) {
        response.basedOnResult(result, session, request);
      });
    }
  }
};