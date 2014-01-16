var fs;

/**
 * Navigate backwards in the browser history, if possible.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/back',
  function(window, session, request, response) {
    var time = session.getPageLoadTimeout();
    window.back().wait(time, function (status) {
      if (status === 'success') {
        response.success(session.getId());
        } else if (status === 'timeout') {
          response.error.timeout(
            'Not can back. Error: ' + status,
            session,
            request
          );
        } else {
          response.error.unknownError(
            'Not can back. Error: ' + status,
            request,
            session
          );
        }
    });
});

/**
 * Click and hold the left mouse button
 * (at the coordinates set by the last moveto command).
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/buttondown',
  function(window, session, request, response) {
    var button = request.body.button;
    button = button === undefined ? 0 : parseInt(button, 10);
    if (isNaN(button)) {
      response.error.missingCommandParameter('button', request);
    } else {
      window.mouse.down(button);
      response.success(session.getId());
    }
});

/**
 * Releases the mouse button previously held (where the mouse is currently at).
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/buttonup',
  function(window, session, request, response) {
    var button = request.body.button;
    button = button === undefined ? 0 : parseInt(button, 10);
    if (isNaN(button)) {
      response.error.missingCommandParameter('button', request);
    } else {
      var time = session.getPageLoadTimeout();
      window.mouse.up(button).wait(time, function (status) {
        response.success(session.getId());
      });
    }
});

/**
 * Click any mouse button (at the coordinates set by the last moveto command).
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/click',
  function(window, session, request, response) {
    var button = request.body.button;
    button = button === undefined ? 0 : parseInt(button, 10);
    if (isNaN(button)) {
      response.error.missingCommandParameter('button', request);
    } else {
      var time = session.getPageLoadTimeout();
      window.mouse.click(button).wait(time, function (status, result) {
        if (status === 'success') {
          response.success(session.getId());
        } else if (result !== undefined) {
          response.basedOnResult(result, session, request);
        } else if (status === 'timeout') {
          response.error.timeout(
            'Click timed-out',
            session,
            request
          );
        } else {
          response.error.unknownError(
            'Click failed: ' + status,
            request,
            session
          );
        }
      });
    }
});

/**
 * Set a cookie.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/cookie',
  function (window, session, request, response) {
    var cookie = request.body.cookie;
    if (cookie === null || typeof cookie !== 'object') {
      response.error.missingCommandParameter('cookie', request);
    } else {
      // JavaScript deals with Timestamps in
      // "milliseconds since epoch": normalize!
      if (cookie.expiry) {
        cookie.expiry *= 1000;
      }
      var now = new Date().getTime();
      if ((cookie.expiry && cookie.expiry <= now) ||
                                              window.cookie.add(cookie)) {
        response.success(session.getId());
      } else if (window.url.indexOf(cookie.domain) === -1) {
        response.error.invalidCookieDomain(
          "Can only set Cookies for the current domain",
          session,
          request
        );
      } else {
        response.error.unableToSetCookie(
          "Unable to set Cookie",
          session,
          request
        );
      }
    }
});

/**
 * Double-clicks at the current mouse coordinates (set by moveto).
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/doubleclick',
  function(window, session, request, response) {
    var time = session.getPageLoadTimeout();
    window.mouse.doubleClick().wait(time, function (status, result) {
        if (status === 'success') {
          response.success(session.getId());
        } else if (result !== undefined) {
          response.basedOnResult(result, session, request);
        } else if (status === 'timeout') {
          response.error.timeout(
            'double click timed-out',
            session,
            request
          );
        } else {
          response.error.unknownError(
            'Double click failed: ' + status,
            request,
            session
          );
        }
    });
});

/**
 * Get the element on the page that currently has focus.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element/active',
  function(window, session, request, response) {
    window.activeElement().then(function(result) {
      response.basedOnResult(
        result,
        session,
        request
      );
    });
});

/**
 * Clear a TEXTAREA or text INPUT element's value.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element/:id/clear',
  function (element, session, request, response) {
    element.clear().then(function(result){
      response.basedOnResult(
        result,
        session,
        request
      );
    });
});

/**
 * Click on an element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element/:id/click',
  function (element, session, request, response) {
    element.isDisplayed().then(function(displayed) {
      if (displayed !== true) {
        response.error.elementNotVisible(
          'Element is not currently visible and may not be manipulated',
          session,
          request
        );
      } else {
        var time = session.getPageLoadTimeout();
        element.click().wait(time, function (status, result) {
          if (status === 'success') {
            response.success(session.getId());
          } else if (result !== undefined) {
            response.basedOnResult(result, session, request);
          } else if (status === 'timeout') {
            response.error.timeout(
              'Click timed-out',
              session,
              request
            );
          } else {
            response.error.unknownError(
              'Click failed: ' + status,
              request,
              session
            );
          }
        });
      }
    });
});

/**
 * Search for an element on the page, starting from the identified element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element/:id/element',
  function (element, session, request, response) {
    var locator = request.body;
    if (locator.using === undefined) {
      response.error.missingCommandParameter('using', request);
    } else if (locator.value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else {
      var time    = session.getImplicitTimeout();
      element.find(locator).wait(time, function (result) {
        response.basedOnResult(
          result,
          session,
          request
        );
      });
    }
});

/**
 * Search for multiple elements on the page, starting from the identified element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element/:id/elements',
  function (element, session, request, response) {
    var locator = request.body;
    if (locator.using === undefined) {
      response.error.missingCommandParameter('using', request);
    } else if (locator.value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else {
      var time    = session.getImplicitTimeout();
      element.findAll(locator).wait(time, function (result) {
        response.basedOnResult(
          result,
          session,
          request
        );
      });
    }
});

/**
 * Submit a FORM element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element/:id/submit',
  function (element, session, request, response) {
    var time = session.getPageLoadTimeout();
    element.submit().wait(time, function (status, result) {
      if (status === 'success') {
        response.success(session.getId());
      } else if (result !== undefined) {
        response.basedOnResult(result);
      } else if (status === 'timeout') {
        response.error.timeout(
          'Submit timed-out',
          session,
          request
        );
      } else {
        response.error.unknownError(
          'Submit failed: ' + status,
          request,
          session
        );
      }
    });
});

/**
 * Send a sequence of key strokes to an element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element/:id/value',
  function (element, session, request, response) {
    var value = request.body.value;
    if (value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else {
      element.getTagName().then(function(tagName) {
        element.getAttribute('type').then(function(type) {
          var timeout = session.getPageLoadTimeout();
          value = value.join('');
          fs = fs || require('fs');
          if (
            tagName === 'input' &&
            type &&
            type.toLowerCase() === 'file' &&
            fs.exists(value)
          ) {
            element.filePicker(value, timeout, function (status, result) {
              if (status === 'success') {
                response.success(session.getId());
              } else if (result !== undefined) {
                response.basedOnResult(result, session, request);
              } else if (status === 'timeout') {
                response.error.timeout(
                  'Click timed-out',
                  session,
                  request
                );
              } else {
                response.error.unknownError(
                  'Click failed: ' + status,
                  request,
                  session
                );
              }
            });
          } else {
            element.sendKeys(value, true).wait(timeout,
              function (status, result) {
                if (status === 'success') {
                  response.success(session.getId());
                } else if (result !== undefined) {
                  response.basedOnResult(result, session, request);
                } else if (status === 'timeout') {
                  response.error.timeout(
                    'SendKeys timed-out',
                    session,
                    request
                  );
                } else {
                  response.error.unknownError(
                    'SendKeys failed: ' + status,
                    request,
                    session
                  );
                }
            });
          }
        });
      });
    }
});

/**
 * Describe the identified element.
 *
 * @param {Element} element
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element/:id',
  function(element, session, request, response) {
    response.success(
      session.getId(),
      element.getId()
    );
});

/**
 * Search for an element on the page, starting from the document root.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/element',
  function (window, session, request, response) {
    var locator = request.body;
    if (locator.using === undefined) {
      response.error.missingCommandParameter('using', request);
    } else if (locator.value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else {
      var time    = session.getImplicitTimeout();
      window.find(locator).wait(time, function (result) {
        response.basedOnResult(
          result,
          session,
          request
        );
      });
    }
});

/**
 * Search for multiple elements on the page, starting from the document root.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/elements',
  function (window, session, request, response) {
    var locator = request.body;
    if (locator.using === undefined) {
      response.error.missingCommandParameter('using', request);
    } else if (locator.value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else {
      var time    = session.getImplicitTimeout();
      window.findAll(locator).wait(time, function (result) {
        response.basedOnResult(
          result,
          session,
          request
        );
      });
    }
});

/**
 * Inject a snippet of JavaScript into the page for execution in
 * the context of the currently selected frame.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/execute',
  function (window, session, request, response) {
    var params = request.body;
    if (params.script === undefined) {
      response.error.missingCommandParameter('script', request);
    } else if(params.args === undefined) {
      response.error.missingCommandParameter('args', request);
    } else {
      var
        timeout = false,
        wait   = session.getScriptTimeout(),
        timeId = setTimeout(function() {
          timeout = true;
          response.error.timeout(
            "Script didn't return within " +  wait + "ms",
            session,
            request
          );
        }, wait);

      window.executeScript(params.script, params.args).then(function(result) {
        clearTimeout(timeId);
        if (!timeout) {
          response.basedOnResult(
            result,
            session,
            request
          );
        }
      });
    }
});

/**
 * Inject a snippet of JavaScript into the page for execution in
 * the context of the currently selected frame.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/execute_async',
  function (window, session, request, response) {
    var params = request.body;
    if (params.script === undefined) {
      response.error.missingCommandParameter('script', request);
    } else if(params.args === undefined) {
      response.error.missingCommandParameter('args', request);
    } else {
      window.executeAsyncScript(
        params.script,
        params.args,
        session.getAsyncScriptTimeout(),
        function (result) {
          response.basedOnResult(result, session, request);
        }
      ).then(function() {
        // notingh
      });
    }
});

/**
 * Navigate forwards in the browser history, if possible.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/forward',
  function(window, session, request, response) {
    var time = session.getPageLoadTimeout();
    window.forward().wait(time, function (status) {
      if (status === 'success') {
        response.success(session.getId());
        } else if (status === 'timeout') {
          response.error.timeout(
            'Not can forward. Error: ' + status,
            session,
            request
          );
        } else {
          response.error.unknownError(
            'Not can forward. Error: ' + status,
            request,
            session
          );
        }
    });
});

/**
 * Change focus to another frame on the page.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/frame',
  function (window, session, request, response) {
    var id = request.body.id;
    if (id === undefined) {
      response.error.missingCommandParameter('id', request);
    } else {
      window.frame(id).then(function(frame) {
        if (frame === undefined) {
          response.error.noSuchFrame(
            'the frame could not be found',
            session,
            request
          );
        } else {
          frame.focus();
          response.success(session.getId());
        }
      });
    }
});

/**
 * Send a sequence of key strokes to the active element.
 *
 */
router.post('/session/:sessionId/keys',
  function (window, session, request, response) {
    window.activeElement().then(function(id) {
      var
          element = new window.Element(id),
          value   = request.body.value;
      if (value === undefined) {
        response.error.missingCommandParameter('value', request);
      } else {
        element.getTagName().then(function(tagName) {
          element.getAttribute('type').then(function(type) {
            var timeout = session.getPageLoadTimeout();
            value = value.join('');
            fs = fs || require('fs');
            if (tagName === 'input' && type &&
                                type.toLowerCase() === 'file' &&
                                fs.exists(value)) {
              window.on('filePicker', function () {
                return value;
              });
              element.click().wait(timeout, function (status, result) {
                if (status === 'success') {
                  response.success(session.getId());
                } else if (result !== undefined) {
                  response.basedOnResult(result, session, request);
                } else if (status === 'timeout') {
                  response.error.timeout(
                    'Click timed-out',
                    session,
                    request
                  );
                } else {
                  response.error.unknownError(
                    'Click failed: ' + status,
                    request,
                    session
                  );
                }
              });
            } else {
              element.sendKeys(value).wait(timeout, function (status, result) {
                if (status === 'success') {
                  response.success(session.getId());
                } else if (result !== undefined) {
                  response.basedOnResult(result, session, request);
                } else if (status === 'timeout') {
                  response.error.timeout(
                    'Click timed-out',
                    session,
                    request
                  );
                } else {
                  response.error.unknownError(
                    'Click failed: ' + status,
                    request,
                    session
                  );
                }
              });
            }
          });
        });
      }
    });
});

/**
 * Set the storage item for the given key.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/local_storage',
  function (window, session, request, response) {
    var params = request.body;
    if (params.key === undefined) {
      response.error.missingCommandParameter('key', request);
    } else if(params.value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else {
      window.localStorage().setItem(params.key, params.value).
        then(function(result) {
          response.basedOnResult(
            result,
            session,
            request
          );
      });
    }
});

/**
 * Move the mouse by an offset of the specificed element.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/moveto',
  function(window, session, request, response) {
    var params = request.body,
        x = 0,
        y = 0;
    if (params.element) {
      var element  = new window.Element(params.element);
      element.getLocationInView().then(function(location) {
        element.getSize().then(function(size) {
          if (location !== null) {
            x = location.x;
            y = location.y;
          }
          if (params.xoffset || params.yoffset) {
            x += params.xoffset || 0;
            y += params.yoffset || 0;
          } else {
            x += Math.floor(size.width / 2);
            y += Math.floor(size.height / 2);
          }
        });
        window.mouse.move(x, y);
        response.success(session.getId());
      });
    } else if (params.xoffset === undefined) {
        return response.error.missingCommandParameter('xoffset', request);
    } else if (params.yoffset === undefined) {
      return response.error.missingCommandParameter('yoffset', request);
    } else {
      window.mouse.move(params.xoffset, params.yoffset, true);
      response.success(session.getId());
    }
});

/**
 * Refresh the current page.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/refresh',
  function (window, session, request, response) {
    var time = session.getPageLoadTimeout();
    window.reload().wait(time, function (status) {
      if (status === 'success') {
        response.success(session.getId());
      } else if (status === 'timeout') {
        response.error.timeout(
          'Not can refresh current page. Error: ' + status,
          session,
          request
        );
      } else {
        response.error.unknownError(
          'Not can refresh current page. Error: ' + status,
          request,
          session
        );
      }
    });
});

/**
 * Set the storage item for the given key.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/session_storage',
  function (window, session, request, response) {
    var params = request.body;
    if (params.key === undefined) {
      response.error.missingCommandParameter('key', request);
    } else if(params.value === undefined) {
      response.error.missingCommandParameter('value', request);
    } else {
      window.sessionStorage().setItem(params.key,params.value).
        then(function (result) {
          response.basedOnResult(
            result,
            session,
            request
          );
        });
    }
});

/**
 * Set the amount of time, in milliseconds, that asynchronous
 * scripts executed by /session/:sessionId/execute_async are permitted to run
 * before they are aborted and a |Timeout| error is returned to the client.
 *
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/timeouts/async_script',
  function (session, request, response) {
    var ms = request.body.ms;
    if (typeof ms !== 'number') {
      response.error.missingCommandParameter('ms', request);
    } else {
      session.setAsyncScriptTimeout(ms);
      response.success(session.getId());
    }
});

/**
 * Set the amount of time the driver should wait when searching for elements.
 *
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/timeouts/implicit_wait',
  function (session, request, response) {
    var ms = request.body.ms;
    if (typeof ms !== 'number') {
      response.error.missingCommandParameter('ms', request);
    } else {
      session.setImplicitTimeout(ms);
      response.success(session.getId());
    }
});

/**
 * Configure the amount of time that a particular type of operation
 * can execute for before they are aborted and a |Timeout| error
 * is returned to the client.
 *
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/timeouts',
  function (session, request, response) {
    var
      params = request.body,
      callback;
    if (
        typeof params.type === undefined || (
          callback = session.findTimeout(params.type)
        )
    ) {
      response.error.missingCommandParameter('type', request);
    } else if (typeof params.ms !== 'number') {
      response.error.missingCommandParameter('ms', request);
    } else {
      callback(params.ms);
      response.success(session.getId());
    }
});

/**
 * Navigate to a new URL.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/url',
  function(window, session, request, response) {
    var url = request.body.url;
    if (url === undefined) {
      response.error.missingCommandParameter('url', request);
    } else {
      var time = session.getPageLoadTimeout();
      window.open(url).wait(time, function (status) {
        if (status !== 'timeout') {
          response.success(session.getId());
        } else if (status === 'timeout') {
          response.error.timeout(
            'URL: ' + this.url + " didn't load. Error: " + status,
            session,
            request
          );
        } else {
          response.error.unknownError(
            'URL: ' + this.url + " didn't load. Error: " + status,
            request,
            session
          );
        }
      });
    }
});

/**
 * Maximize the specified window if not already maximized.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/window/:windowHandle/maximize',
  function (window, session, request, response) {
    window.maximize(function (error) {
      if (error === null) {
        response.success(session.getId());
      } else {
        response.error.unknownError(
          error,
          session,
          request
        );
      }
    });
});

/**
 * Change the position of the specified window.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/window/:windowHandle/position',
  function (window, session, request, response) {
    var params = request.body,
        x = parseInt(params.x, 10),
        y = parseInt(params.y, 10);
    if (isNaN(x)) {
      response.error.missingCommandParameter('x', request);
    } else if(isNaN(y)) {
      response.error.missingCommandParameter('y', request);
    } else {
      window.setPosition(x, y).then(function () {
        response.success(session.getId());
      });
    }
});

/**
 * Change the size of the specified window.
 *
 * @param {Window} window
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/window/:windowHandle/size',
  function (window, session, request, response) {
    var params = request.body,
        width = parseInt(params.width, 10),
        height = parseInt(params.height, 10);
    if (isNaN(width)) {
      response.error.missingCommandParameter('width', request);
    } else if(isNaN(height)) {
      response.error.missingCommandParameter('height', request);
    } else {
      window.setSize(width, height).then(function() {
        response.success(session.getId());
      });
    }
});

/**
 * Change focus to another window.
 *
 * @param {Session} session
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session/:sessionId/window',
  function(session, request, response) {
    var name = request.body.name;
    if (name === undefined) {
      response.error.missingCommandParameter('name', request);
    } else {
      var window = session.getWindow(name);
      if (window !== null) {
        window.focus().
          then(function () {
            session.setCurrentWindowHandle(window.handle);
            response.success(session.getId());
          }, function() {
            response.error.unknownError(
              'Unable to change focus to this window: ' + name,
              session,
              request
            );
          });
      } else {
        response.error.noSuchWindow(
          'Unable to switch to window (closed?)',
          session,
          request
        );
      }
    }
/*
    if (session.switchToWindow(name)) {
        response.success(session.getId());
    } else {
      response.error.noSuchWindow(
        'Unable to switch to window (closed?)',
        session,
        request
      );
    }*/
});

/**
 * Create a new session.
 *
 * @param {Request} request
 * @param {Response} response
 */
router.post('/session', function (request, response) {
  var desiredCapabilities  = request.body.desiredCapabilities,
      requiredCapabilities = request.body.requiredCapabilities;
  if(typeof desiredCapabilities === 'object') {
    var session = this.session.create(desiredCapabilities);
    if (session.hasAllRequired(requiredCapabilities)) {
      response.success(session.getId(), session.getCapabilities());
    } else {
      response.error.sessionNotCreatedException(
        'Not can set required capabilities',
        session,
        request
      );
    }
  } else {
    response.error.missingCommandParameter(
      'desiredCapabilities',
      request
    );
  }
});