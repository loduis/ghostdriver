var WebServerResponse = function() {
  var _error = require('./error');

  function body(sessionId, value, statusCode) {
    return {
        'sessionId' : sessionId || null,
        'status'    : statusCode || 0, //< '0' is Success
        'value'     : typeof value === 'undefined' ? {} : value
    };
  }

  function defaultheaders(response) {
    response.setHeader('Cache', 'no-cache');
    response.setHeader('Content-Type', 'application/json;charset=UTF-8');
  }

  function writeJSONAndClose(object) {
      var data = JSON.stringify(object),
          length = unescape(encodeURIComponent(data)).length;
      defaultheaders(this);
      this.setHeader('Content-Length', length);
      this.write(data);
      this.close();
  }

  function success(sessionId, value) {
    this.statusCode = 200;
    if (arguments.length > 0) {
        // write something, only if there is something to write
        this.writeJSONAndClose(body(sessionId, value));
    } else {
        this.closeGracefully();
    }
  }

  function basedOnResult(result, session, request) {
    if (typeof result === 'string') {
      try {
          result = JSON.parse(result);
      } catch (e) {
          // In case the conversion fails, report and "Invalid Command Method" error
          this.error.invalidCommandMethod(request);
          return;
      }
    }
    if (result === null ||
      result === undefined ||
      typeof result !== 'object' ||
      typeof result.status !== 'number' ||
      typeof result.value === 'undefined') {
        this.error.unknownError(
          'Command failed without producing the expected error report',
          request,
          session
        );
    } else if (result.status !== 0) {
      this.error.failedCommand(
        result.status,
        result.value.message,
        session,
        request
      );
    } else {
      this.success(session.getId(), result.value);
    }
  }

  function writeAndClose(body) {
      this.setHeader("Content-Length", unescape(encodeURIComponent(body)).length);
      this.write(body);
      this.close();
  }

  function failure(status, message) {
    this.statusCode = status;
    this.setHeader('Content-Type', 'text/plain');
    this.writeAndClose(message);
  }


  function extend(response) {
    response.success           = success;
    response.failure           = failure;
    response.writeJSONAndClose = writeJSONAndClose;
    response.basedOnResult     = basedOnResult;
    response.writeAndClose     = writeAndClose;
    _error.response            = response;
    response.error             = _error;

    return response;
  }


  return {
    extend: extend
  };

}();

module.exports = WebServerResponse;