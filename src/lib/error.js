var
  error = {},
  _FAILED_CMD_STATUS_CODES = {
    NoSuchElement             : 7,
    NoSuchFrame               : 8,
    UnknownCommand            : 9,
    StaleElementReference     : 10,
    ElementNotVisible         : 11,
    InvalidElementState       : 12,
    UnknownError              : 13,
    ElementIsNotSelectable    : 15,
    JavaScriptError           : 17,
    XPathLookupError          : 19,
    Timeout                   : 21,
    NoSuchWindow              : 23,
    InvalidCookieDomain       : 24,
    UnableToSetCookie         : 25,
    UnexpectedAlertOpen       : 26,
    NoAlertOpenError          : 27,
    ScriptTimeout             : 28,
    InvalidElementCoordinates : 29,
    IMENotAvailable           : 30,
    IMEEngineActivationFailed : 31,
    InvalidSelector           : 32,
    SessionNotCreatedException: 33
  },
  _FAILED_CMD_STATUS_CODES_NAMES = function (error, STATUS_CODE) {
    var
      code,
      command,
      constantName,
      name,
      STATUS_CODE_NAMES = {};
    for (name in STATUS_CODE) {
      code                    = STATUS_CODE[name];
      STATUS_CODE_NAMES[code] = name;
      constantName            = _const(name);
      error[constantName]     = code;
      command                 = name.slice(0, 1).toLowerCase() + name.slice(1);
      error[command]          = _command(code);
    }

    return STATUS_CODE_NAMES;

    // status name to upper case constant
    function _const(string) {
      return string.replace(/([A-Z]+)([a-z])/g, '$1_$2')
                 .replace(/^([A-Z]+)_/g, '$1')
                 .replace(/([A-Z])_/g, '_$1')
                 .replace(/([A-Z]{3})([A-Z][a-z])/g, '$1_$2')
                 .toUpperCase();
    }

    function _command(code) {
      return function (message, session, request) {
        return this.failedCommand(
          code,
          message,
          session,
          request
        );
      };
    }

  }(error, _FAILED_CMD_STATUS_CODES);

function _createError(status, message, request) {
  var error = new Error();
  error.message = message + ', Request: ' +
                  JSON.stringify(request);
  this.response.writeAndClose(500, 'text/plain', error.message);

  return error;
}

error.variableResourceNotFound = function (request) {
  return _createError.call(
    this,
    404,
    'Variable Resource Not Found',
    request
  );
};

error.missingCommandParameter = function (parameter, request) {
  return _createError.call(
    this,
    400,
    'Missing Command Parameters: "' + parameter + '"',
    request
  );
};

error.invalidCommandMethod = function (request) {
  return _createError.call(
    this,
    405,
    'Invalid Command Method',
    request
  );
};

error.failedCommand = function (code, message, session, request, className) {
  var error = new Error(),
      name = _FAILED_CMD_STATUS_CODES_NAMES[code];
  if (name === undefined) {
    code = 13;
    name = _FAILED_CMD_STATUS_CODES_NAMES[code];
  }
  error.name = name;
  error.message = "Error Message => '" + message + "'\n" +
                  "Error Code => '" + code + "'\n" +
              ' caused by Request => ' + JSON.stringify(request);
  error.errorStatusCode = code;
  error.errorSessionId = session.getId() || null;
  error.errorClassName = className || "unknown";
  error.errorScreenshot = (session.getCapabilities().takesScreenshot &&
              session.getWindow() !== null) ?
      session.getWindow().getScreenshot() : '';
  // Generate response body
  var body = {
      'sessionId' : error.errorSessionId,
      'status' : error.errorStatusCode,
      'value' : {
          'message' : error.message,
          'screen' : error.errorScreenshot,
          'class' : error.errorClassName
      }
  };

  // Send it
  this.response.writeAndClose(500, 'application/json', body);

  return error;
};

module.exports = error;
