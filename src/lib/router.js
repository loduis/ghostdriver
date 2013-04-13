var router = {},
    WebServerResponse = require('./response'),
    WebServerRequest = require('./request');

router.dispatch = function (request, response) {
    response = WebServerResponse.extend(response);
    request  = WebServerRequest.extend(request);
    var callback = request.getCallback();
    if (callback === null) {
      response.error.invalidCommandMethod(request);
    } else {
      var sessionId = request.getSessionId(),
          session   = null;
      if (sessionId !== null) {
        session = ghostdriver.Session.get(sessionId);
        if (session === null) {
          response.error.variableResourceNotFound(request);
        } else if (callback.numArguments === 4) {
          var handle = request.getWindowHandle(),
              window = session.getWindow(handle);
          if (window === null) {
            response.error.noSuchWindow(
              'the currently selected window has been closed',
              session,
              request
            );
          } else {
            var id = request.getElementId(),
                element = window;
            if (id !== undefined) {
              element = new window.Element(id);
            }
            var result = callback.call(
                ghostdriver,
                element,
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