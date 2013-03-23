require ('./core');

var Window = function () {

  var _WebPage = require('webpage'),
      _slice = Array.prototype.slice,
      requireAtoms = function () {
        var fs = require('fs'),
            atomsCache = {};

        return function(atomName) {
          if (!atomsCache.hasOwnProperty(atomName)) {
              var atomFileName = module.dirname + '/webdriver-atoms/' +
                                 atomName + '.js';
              try {
                  atomsCache[atomName] = fs.read(atomFileName);
              } catch (e) {
                  throw "Unable to load Atom '" + atomName +
                        "' from file '"+atomFileName+"'";
              }
          }

          return atomsCache[atomName];
        };
      }(),
      _capitalize = function (word) {
        return word.charAt(0).toUpperCase() + word.substring(1);
      },
      _wait = function (){
        var _timerId = null;
        function _waitLoop(startTime, retry, timeout) {
          var time = new Date().getTime();
          if (time >= startTime + timeout) {
            this.fire('wait', 'fail', ['timeout']);
          } else {
            _timerId = setTimeout(_waitLoop.bind(this, startTime, retry, timeout), retry);
          }
        }

        function _wait(retry, timeout, success, failure) {
          this.on('wait', function(status, args){
            clearTimeout(_timerId);
            _timerId = null;
            this.onReset();
            if (status === 'success') {
              success.apply(this, args);
            } else {
              failure.apply(this, args);
            }
          });
          var startTime = new Date().getTime();
          _timerId = setTimeout(_waitLoop.bind(this, startTime, retry, timeout), 10);
        }

        return function (retry) {
          return {
            wait: _wait.bind(this, retry)
          };
        };

      }();

  function Window(handle, settings) {
    settings = settings || {};
    this._page = _WebPage.create();
    // Decorating:
    // 0. Pages lifetime will be managed by Driver, not the pages
    this._page.ownsPages = false;
    // 1. Random Window Handle
    this.handle = handle;
    // 2. Initialize the One-Shot Callbacks
    //page.onLoadStarted  = _oneShotCallbackFactory(page, "onLoadStarted");
    //page.onLoadFinished = _oneShotCallbackFactory(page, "onLoadFinished");
    //page.onUrlChanged   = _oneShotCallbackFactory(page, "onUrlChanged");
    //page.onFilePicker   = _oneShotCallbackFactory(page, "onFilePicker");
    //page.onCallback     = _oneShotCallbackFactory(page, "onCallback");
    // 3. Utility methods
    //page.execFuncAndWaitForLoad = _execFuncAndWaitForLoadDecorator;
    //page.setOneShotCallback     = _setOneShotCallbackDecorator;
    //page.resetOneShotCallbacks  = _resetOneShotCallbacksDecorator;
    // 4. Store every newly created page
    //page.onPageCreated = _addNewPage;
    // 5. Remove every closing page
    //page.onClosing = _deleteClosingPage;
    // 6. Applying Page settings received via capabilities
    for (var k in settings) {
        // Apply setting only if really supported by PhantomJS
        if (this._page.settings.hasOwnProperty(k)) {
            this._page.settings[k] = settings[k];
        }
    }
  }

  (function (prototype){

    prototype.open = function (url) {
      this._page.stop();
      this.onReset();
      this._page.switchToMainFrame();
      this.on('loadFinished', function (status) {
        this.fire('wait', status, []);
      });
      this._page.open(url);
      return _wait.call(this, 100);
    };

    prototype.eval = function (name) {
      var args = _slice.call(arguments, 0);
      if (name === 'get_location' || name === 'get_location_in_view') {
        var params = args.slice(1),
            script     = 'return (' + requireAtoms(name) + ')(arguments[0])';
        name = 'execute_script';
        args = [
          requireAtoms(name),
          script,
          params
        ];
      } else if (name === 'execute_async_script') {
        var source = "function(script, args, timeout) {" +
                        "return (" + requireAtoms(name) + ")" +
                        "(script, args, timeout, callPhantom, true); " +
                     "}";
        //var source = "return (function(script, args, timeout){})(arguments[0]);";
        args[0]  = source;
        //console.log(JSON.stringify(args));
      } else {
        args[0]  = requireAtoms(name);
      }
      return this._page.evaluate.apply(this._page, args);
    };

    prototype.render = function(filename) {
      this._page.render(filename);
    };

    prototype.__defineGetter__('title', function () {
      return this._page.title;
    });

    prototype.__defineGetter__('source', function () {
      return this._page.frameContent;
    });

    prototype.getScreenshot = function () {
      return this._page.renderBase64('png');
    };

    prototype.__defineGetter__('cookies', function () {
      return this._page.cookies;
    });

    prototype.addCookie = function (cookie) {
      return this._page.addCookie(cookie);
    };

    prototype.deleteCookie = function (cookie) {
      return this._page.deleteCookie(cookie);
    };

    prototype.clearCookies = function () {
      return this._page.clearCookies();
    };

    prototype.__defineGetter__('url', function () {
      return this._page.url;
    });

    prototype.on = function (eventName, callback) {
      var self = this;
      eventName = 'on' + _capitalize(eventName);
      //this._page[eventName] = callback.bind(self);
      this._page[eventName] = function () {
        callback.apply(self, _slice.call(arguments, 0));
      };
    };

    prototype.fire = function(eventName) {
      eventName = 'on' + _capitalize(eventName);
      var callback = this._page[eventName];
      callback.apply(this, _slice.call(arguments, 1));
    };

    prototype.reload = function () {
      this._page.stop();
      this.onReset();
      this.on('loadFinished', function (status) {
        this.fire('wait', status, []);
      });
      this._page.reload();
      return _wait.call(this, 100);
    };

    prototype.onReset = function () {
      this.off('callback');
      this.off('loadFinished');
    };

    prototype.off = function(eventName) {
      delete this._page[eventName];
    };


  })(Window.prototype);

  /*

  Window.create = function(handle, settings) {
    var window = new Window(handle, settings);
    _windows[handle] = window;
    return window;
  };

  Window.getAll = function() {
    return _windows;
  };

  Window.get = function (handle) {
    var window = null;
    if (_windows.hasOwnProperty(handle)) {
      window = _windows[handle];
    }
    return window;
  };

  Window.close = function (handle) {
    if (_windows.hasOwnProperty(handle)) {
      delete _windows[handle];
      return true;
    }
    return false;
  };*/

  return Window;

}();

module.exports = Window;