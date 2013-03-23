var router = {},
    WebServerResponse = require('./response'),
    WebServerRequest = require('./request');

function argumentCount(functionName) {
  var names = functionName.toString().
      match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].split(',');
  return names.length;
}

router.dispatch = function (request, response) {
    response = WebServerResponse.extend(response);
    request  = WebServerRequest.extend(request);
    var callback = request.getCallback();
    if (callback === null) {
      response.error.invalidCommandMethod(request);
    } else {
      var sessionId = request.getSessionId(),
        session = null;
      if (sessionId !== null) {
        session = ghostdriver.Session.get(sessionId);
        if (session === null) {
          response.error.variableResourceNotFound(request);
        } else if (argumentCount(callback) === 4) {
          var window = session.getWindow();
          if (window === null) {
            response.error.noSuchWindow(
              'the currently selected window has been closed',
              session,
              request
            );
          } else {
            var result = callback.call(
              ghostdriver,
              window,
              session,
              request,
              response
            );
            if (result !== undefined) {
              response.basedOnResult(result, session, request);
            }
          }
        } else {
          callback.call(ghostdriver, session, request, response);
        }
      } else {
        callback.call(ghostdriver, request, response);
      }
    }
};

module.exports = router;