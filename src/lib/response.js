var WebServerResponse = function() {
  var _error = require('./error');

  function body(sessionId, value, statusCode) {
    return {
        'sessionId' : sessionId || null,
        'status'    : statusCode || 0, //< '0' is Success
        'value'     : typeof value === 'undefined' ? {} : value
    };
  }

  function success(sessionId, value) {
    if (arguments.length > 0) {
        this.writeAndClose(
          200,
          'application/json',
          body(sessionId, value)
        );
    } else {
        this.closeGracefully();
    }
  }

  function basedOnResult(result, session, request) {
    if (result === null || !result.hasOwnProperty('status')) {
      var tmp = result;
      result = {};
      result.status = 0;
      result.value = tmp;
    }

    if (typeof result !== 'object' ||
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

  function writeAndClose(status, contentType, body) {
      this.statusCode = status;
      if (contentType.indexOf('json') !== -1) {
        body = JSON.stringify(body);
        this.setHeader('Cache', 'no-cache');
      }
      this.setHeader('Content-Type', contentType  + ';charset=UTF-8');
      this.setHeader('Content-Length', unescape(encodeURIComponent(body)).length);
      this.write(body);
      this.close();
  }


  function redirect(status, url) {
    this.statusCode = status;
    this.setHeader('Location', url);
    this.closeGracefully();
  }


  function extend(response) {
    response.success           = success;
    response.redirect          = redirect;
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