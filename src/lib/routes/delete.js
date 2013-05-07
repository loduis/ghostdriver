/**
 * Delete the cookie with the given name.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.delete('/session/:sessionId/cookie/:name',
  function (window, session, request, response) {
    window.cookie.remove(request.params.name);
    response.success(session.getId());
});

/**
 * Delete all cookies visible to the current page.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.delete('/session/:sessionId/cookie',
  function (window, session, request, response) {
    window.cookie.clear();
    response.success(session.getId());
});

/**
 * Remove the storage item for the given key.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.delete('/session/:sessionId/local_storage/key/:key',
  function (window, session, request, response) {
    response.basedOnResult(
      window.localStorage.removeItem(request.params.key),
      session,
      request
    );
});

/**
 * Clear the storage.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.delete('/session/:sessionId/local_storage',
  function (window, session, request, response) {
    response.basedOnResult(
      window.localStorage.clear(),
      session,
      request
    );
});

/**
 * Remove the storage item for the given key.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.delete('/session/:sessionId/session_storage/key/:key',
  function (window, session, request, response) {
    response.basedOnResult(
      window.sessionStorage.removeItem(request.params.key),
      session,
      request
    );
});

/**
 * Clear the storage.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.delete('/session/:sessionId/session_storage',
  function (window, session, request, response) {
    response.basedOnResult(
      window.sessionStorage.clear(),
      session,
      request
    );
});

/**
 * Close the current window.
 *
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.delete('/session/:sessionId/window',
  function (session, request, response) {
    var name = request.body.name;
    if (session.closeWindow(name)) {
      response.success(session.getId());
    } else {
      response.error.noSuchWindow(
        'Unable to close window (closed already?)',
        session,
        request
      );
    }
});

/**
 * Delete the session.
 *
 * @param {Request} request
 * @param {Response} response
 */
router.delete('/session/:sessionId', function (request, response) {
  var id = request.params.sessionId;
  if (this.session.close(id)) {
    response.success(id);
  } else {
    response.error.variableResourceNotFound(request);
  }
});