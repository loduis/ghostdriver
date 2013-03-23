var Element = function () {
  var
  Element = {},
  _supportedStrategies = [
      "class name", "className",              //< Returns an element whose class name contains the search value; compound class names are not permitted.
      "css", "css selector",                  //< Returns an element matching a CSS selector.
      "id",                                   //< Returns an element whose ID attribute matches the search value.
      "name",                                 //< Returns an element whose NAME attribute matches the search value.
      "link text", "linkText",                //< Returns an anchor element whose visible text matches the search value.
      "partial link text", "partialLinkText", //< Returns an anchor element whose visible text partially matches the search value.
      "tag name", "tagName",                  //< Returns an element whose tag name matches the search value.
      "xpath"                                 //< Returns an element matching an XPath expression.
  ];

  function _time() {
    return new Date().getTime();
  }

  function _execute(command, window, locator, stopTime, callback) {
    var result = window.eval(command, locator.using, locator.value);
    result = JSON.parse(result);
    if (result.hasOwnProperty('status') &&
        result.status === 0 &&
        result.hasOwnProperty('value') &&
        result.value !== null) {
          callback(result);
    } else if (stopTime >= _time()) {
        // Recursive call in 50ms
        setTimeout(
          function(){
            _execute(command, window, locator, stopTime, callback);
          },
          50
        );
    } else {
      callback(result);
    }
  }

  function _getCommand(command, window, session, request, response) {
    var params = request.getParams();
    if (typeof params.using === undefined) {
      response.error.missingCommandParameter('using', request);
    } else if (typeof params.value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else if (_supportedStrategies.indexOf(params.using) === -1) {
      response.error.UnknownError(
        'Invalid locator received',
        session,
        request
      );
    } else {
      var
        callback = function (result) {
          // only find_element return null find_elements return []
          var status = result.status;
          if (result.value === null) {
            result.status = response.error.NO_SUCH_ELEMENT;
            result.value = {message: 'No Such Element found'};
          } else if (status !== 0) {
            result.status = response.error.translateDomErrorCode(result.status);
          }
          response.basedOnResult(result, session, request);
        },
        stopTime = _time() + session.getImplicitTimeout();

      return [command, window, params, stopTime, callback];
    }
  }

  Element.find = function (window, session, request, response) {
    var params = _getCommand('find_element', window, session, request, response);
    if (params !== undefined) {
      _execute.apply(null, params);
    }
  };


  Element.findAll = function (window, session, request, response) {
    var params = _getCommand('find_elements', window, session, request, response);
    if (params !== undefined) {
      _execute.apply(null, params);
    }
  };

  return Element;

}();

module.exports = Element;