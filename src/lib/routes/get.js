/**
 * Gets the text of the currently displayed JavaScript alert(),
 * confirm(), or prompt() dialog.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/alert_text',
  function(window, session, request, response) {
    response.basedOnResult(
      window.alert.text,
      session,
      request
    );
});

/**
 * Get the status of the html5 application cache.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/application_cache/status',
  function (window, session, request, response) {
    response.success(
      session.getId(),
      window.appCacheStatus
    );
});

/**
 * Retrieve all cookies visible to the current page.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/cookie',
  function (window, session, request, response) {
    response.success(
      session.getId(),
      window.cookie.all
    );
});

/**
 * Get the value of an element's attribute.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/attribute/:name',
  function (element, session, request, response) {
    response.basedOnResult(
      element.getAttribute(request.params.name),
      session,
      request
    );
});

/**
 * Query the value of an element's computed CSS property.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/css/:propertyName',
  function (element, session, request, response) {
    response.basedOnResult(
      element.getStyle(request.params.propertyName),
      session,
      request
    );
});

/**
 * Determine if an element is currently displayed.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/displayed',
  function (element, session, request, response) {
    response.basedOnResult(
      element.isDisplayed(),
      session,
      request
    );
});

/**
 * Determine if an element is currently enabled.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/enabled',
  function (element, session, request, response) {
    response.basedOnResult(
      element.isEnabled(),
      session,
      request
    );
});

/**
 * Test if two element IDs refer to the same DOM element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/equals/:other',
  function (element, session, request, response) {
    response.basedOnResult(
      element.equal(request.params.other),
      session,
      request
    );
});

/**
 * Determine an element's location on the page.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/location',
  function (element, session, request, response) {
    response.basedOnResult(
      element.getLocation(),
      session,
      request
    );
});

/**
 * Determine an element's location on the screen
 * once it has been scrolled into view.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/location_in_view',
  function (element, session, request, response) {
    response.basedOnResult(
      element.getLocationInView(),
      session,
      request
    );
});

/**
 * Query for an element's tag name.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/name',
  function(element, session, request, response) {
    response.basedOnResult(
      element.getTagName(),
      session,
      request
    );
});

/**
 * Determine if an OPTION element, or an INPUT element of type checkbox
 * or radiobutton is currently selected.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/selected',
  function (element, session, request, response) {
    response.basedOnResult(
      element.isSelected(),
      session,
      request
    );
});

/**
 * Determine an element's size in pixels.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/size',
  function (element, session, request, response) {
    response.basedOnResult(
      element.getSize(),
      session,
      request
    );
});

/**
 * Returns the visible text for the element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id/text',
  function (element, session, request, response) {
    response.basedOnResult(
      element.getText(),
      session,
      request
    );
});

/**
 * Describe the identified element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/element/:id',
  function (element, session, request, response) {
    response.basedOnResult(
      element.getId(),
      session,
      request
    );
});

/**
 * Get the storage item for the given key.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/local_storage/key/:key',
  function (window, session, request, response) {
    response.basedOnResult(
      window.localStorage.getItem(request.params.key),
      session,
      request
    );
});

/**
 * Get the number of items in the storage.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/local_storage/size',
  function (window, session, request, response) {
    response.basedOnResult(
      window.localStorage.length,
      session,
      request
    );
});

/**
 * Get all keys of the storage.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/local_storage',
  function (window, session, request, response) {
    response.basedOnResult(
      window.localStorage.keys,
      session,
      request
    );
});

/**
 * Take a screenshot of the current page.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/screenshot',
  function (window, session, request, response) {
    response.success(
      session.getId(),
      window.getScreenshot()
    );
});

/**
 * Get the storage item for the given key.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/session_storage/key/:key',
  function (window, session, request, response) {
    response.basedOnResult(
      window.sessionStorage.getItem(request.params.key),
      session,
      request
    );
});

/**
 * Get the number of items in the storage.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/session_storage/size',
  function (window, session, request, response) {
    response.basedOnResult(
      window.sessionStorage.length,
      session,
      request
    );
});

/**
 * Get all keys of the storage.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/session_storage',
  function (window, session, request, response) {
    response.basedOnResult(
      window.sessionStorage.keys,
      session,
      request
    );
});

/**
 * Get the current page source.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/source',
  function (window, session, request, response) {
    response.success(
      session.getId(),
      window.source
    );
});

/**
 * Get the current page title.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/title',
  function (window, session, request, response) {
    response.success(
      session.getId(),
      window.title
    );
});

/**
 * Retrieve the URL of the current page.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/url',
  function(window, session, request, response) {
    response.basedOnResult(
      window.url,
      session,
      request
    );
});

/**
 * Get the position of the specified window.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/window/:windowHandle/position',
  function (window, session, request, response) {
    response.success(
      session.getId(),
      window.getPosition()
    );
});

/**
 * Get the size of the specified window.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/window/:windowHandle/size',
  function (window, session, request, response) {
    response.success(
      session.getId(),
      window.getSize()
    );
});

/**
 * Retrieve the current window handle.
 *
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/window_handle',
  function (session, request, response) {
    response.success(
      session.getId(),
      session.getCurrentWindowHandle()
    );
});

/**
 * Retrieve the list of all window handles available to the session.
 *
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId/window_handles',
  function (session, request, response) {
    response.success(
      session.getId(),
      session.getWindowHandles()
    );
});

/**
 * Retrieve the capabilities of the specified session.
 *
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.get('/session/:sessionId', function (session, request, response) {
  response.success(
    session.getId(),
    session.getCapabilities()
  );
});

/**
 * Returns a list of the currently active sessions.
 *
 * @param {Request} request
 * @param {Response} response
 */
router.get('/sessions', function (request, response) {
  response.success(
    null,
    this.session.all()
  );
});

router.get('/shutdown', function (request, response) {
  response.writeAndClose(
    200,
    'text/html;charset=UTF-8',
    '<html><body>Closing...</body></html>'
  );
});

/**
 * Query the server's current status.
 *
 * @param {Request} request
 * @param {Response} response
 */
router.get('/status', function (request, response) {
  response.success(null, {
    build : {
      version   : this.version
    },
    os : {
      name      : this.os.name,
      version   : this.os.version,
      arch      : this.os.architecture
    }
  });
});