var
  router = {},
  WebServerResponse = require('./response'),
  WebServerRequest  = require('./request');

router.dispatch = function (request, response) {
  WebServerResponse.extend(response);
  WebServerRequest.extend(request);
  // callback for request
  var callback = request.getCallback();
  if (callback === null) {
    response.error.invalidCommandMethod(request);
  } else if (callback.numArguments === 2) {
    callback.call(ghostdriver, request, response);
  } else {
    var sessionId = request.getSessionId(),
        session   = ghostdriver.session.get(sessionId);
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
        callback.call(
          ghostdriver,
          element,
          session,
          request,
          response
        );
      }
    } else {
      callback.call(ghostdriver, session, request, response);
    }
  }
};

module.exports = router;