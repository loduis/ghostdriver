require ('./core');

var _WebPage  = require('webpage'),
    //_Element  = require('./element'),
    //_Mouse    = require('./mouse'),
    //_Keyboard = require('./keyboard'),
    //_Wait     = require('./wait'),
    _Alert     = require('./alert'),
    _defineGetter = require('./getter');



function Window(handle, settings, page) {
  // page instance
  this._page = page || _WebPage.create();
  // Pages lifetime will be managed by Driver, not the pages
  this._page.ownsPages = false;
  // is loading page.
  this._page.loading = false;
  // 1. Random Window Handle
  this.handle = handle;
  // manange internal window position
  this._position = {
    x: 0,
    y: 0
  };
  // page settings
  settings = settings || {};
  for (var k in settings) {
      // Apply setting only if really supported by PhantomJS
      if (this._page.settings.hasOwnProperty(k)) {
          this._page.settings[k] = settings[k];
      }
  }
  // element instance
  //this.Element  = _Element.bind(null, this);
  // instance for manage alert.
  this.alert    = new _Alert(this);

  //============ EVENT ==============//

  // event on load stared
  this.on('loadStarted', function () {
    console.log('load...');
    this._page.loading = true; // fixed for phantomjs 1.8.x
  });
  // event load finished
  this.on('loadFinished', function (status) {
    this._page.loading = false;
    this.fire('load', status);
  });

  this.on('callback', function (result) {
    this.fire('result', result);
  });
  /*
  this.on('consoleMessage', function (msg) {
    console.log('MESSAGE: ' + msg);
  });*/
}

(function (window){
  var
  _slice = Array.prototype.slice,
  _supportedStrategies = [
      "class name", "className",              //< Returns an element whose class name contains the search value; compound class names are not permitted.
      "css", "css selector",                  //< Returns an element matching a CSS selector.
      "id",                                   //< Returns an element whose ID attribute matches the search value.
      "name",                                 //< Returns an element whose NAME attribute matches the search value.
      "link text", "linkText",                //< Returns an anchor element whose visible text matches the search value.
      "partial link text", "partialLinkText", //< Returns an anchor element whose visible text partially matches the search value.
      "tag name", "tagName",                  //< Returns an element whose tag name matches the search value.
      "xpath"                                 //< Returns an element matching an XPath expression.
  ],
  //_Storage = require('./storage'),
  _requireAtoms = require('./atoms'),
  _capitalize = function (word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
  };

  // instance of wait
  //this.wait     = new _Wait(this);
  _defineGetter(window, 'wait', function (Wait) {
    return new Wait(this);
  });

  // instance of keyboard
  //this.keyboard = new _Keyboard(this);
  _defineGetter(window, 'keyboard', function (Keyboard) {
    return new Keyboard(this._page);
  });

  // instance for manage event mouse
  //this.mouse    = new _Mouse(this);
  _defineGetter(window, 'mouse', function (Mouse) {
    return new Mouse(this._page, this.keyboard, this.wait);
  });

  // instance for manage cookie
  _defineGetter(window, 'cookie', function (Cookie) {
    return new Cookie(this._page);
  });

  // instance for manage local storage
  _defineGetter(window, 'localStorage', 'storage', function (Storage) {
    return new Storage(this, 'local');
  });

  _defineGetter(window, 'sessionStorage', 'storage', function (Storage) {
    return new Storage(this, 'session');
  });

  _defineGetter(window, 'Element', function (Element) {
    return Element.bind(null, this);
  });

  _defineGetter(window, 'maximize', function (maximize) {
    return maximize;
  });





  window.open = function (url) {
    this._page.stop();
    this.focus();
    this._page.open(url);
    return this.wait.load();
  };

  window.eval = function (name) {
    var args = _slice.call(arguments, 0);

    /*if (name === 'get_location'/* || name === 'get_location_in_view') {
      var params = args.slice(1),
          script     = 'return (' + _requireAtoms(name) + ')(arguments[0])';
      name = 'execute_script';
      args = [
        _requireAtoms(name),
        script,
        params
      ];
    } else */
    /*
    if (name === 'execute_async_script') {
      var source = "function(script, args, timeout) {" +
                      "return (" + _requireAtoms(name) + ")" +
                        "(script, args, timeout, callPhantom); " +
                   "}";
      args[0]  = source;
    } else {
      args[0]  = _requireAtoms(name);
    }*/

    args[0]  = _requireAtoms(name);
    var result = this._page.evaluate.apply(this._page, args);

    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch (e) {
        result = {};
      }
    }

    if (!result.hasOwnProperty('status')) {
      result = {};
    }

    return result;
  };

  window.render = function(filename) {
    this._page.render(filename);
  };

  window.__defineGetter__('title', function () {
    return this._page.title;
  });

  window.__defineGetter__('source', function () {
    return this._page.frameContent;
  });

  window.getScreenshot = function () {
    return this._page.renderBase64('png');
  };

  window.__defineGetter__('url', function () {
    return this._page.url;
  });

  window.__defineGetter__('name', function () {
    return this._page.windowName;
  });

  window.on = function (eventName, callback) {
    var self = this;
    eventName = 'on' + _capitalize(eventName);
    //this._page[eventName] = callback.bind(self);
    this._page[eventName] = function () {
      callback.apply(self, _slice.call(arguments, 0));
    };
  };

  window.fire = function(eventName) {
    eventName = 'on' + _capitalize(eventName);
    var callback = this._page[eventName];
    callback.apply(this, _slice.call(arguments, 1));
  };


  window.reload = function () {
    this._page.stop();
    this._page.reload();
    return this.wait.load();
  };

  window.off = function(eventName) {
    delete this._page[eventName];
  };

  window.close = function () {
    this._page.close();
  };

  window.find = function (locator, context) {
    var execute = this.eval.bind(
      this,
      'find_element',
      locator.using,
      locator.value,
      context
    );
    return this.wait.result(50, execute);
  };

  window.findAll = function (locator, context) {
    var execute = this.eval.bind(
      this,
      'find_elements',
      locator.using,
      locator.value,
      context
    );
    return this.wait.result(50, execute);
  };

  window.isInValidLocator = function (locator) {
    return _supportedStrategies.indexOf(locator.using) === -1 ||
          locator.value === '' || locator.value === null;
  };

  window.getSize = function () {
    return this._page.viewportSize;
  };

  window.setSize = function (width, height) {
    this._page.viewportSize = {
        width : width,
        height : height
    };
  };

  window.getPosition = function () {
    return this._position;
  };

  window.setPosition = function (x, y) {
    this._position = {
      x: x,
      y: y
    };
  };



  /*window.maximize = function () {
    var platform, spawn;
    function maximize(callback) {
      spawn = spawn || require('child_process').spawn;
      platform = platform || require('system').os.name;
      var self = this;
      if (platform === 'linux') {
        var xrandr    = spawn('xrandr', []);
        // success
        xrandr.stdout.on('data', function (data) {
          var regex = /current (\d+) x (\d+)/,
              match  = regex.exec(data);
          if (match) {
            self.setSize(parseInt(match[1], 10), parseInt(match[2], 10));
            callback(null)
          } else {
            callback('Error not cant match /current (\d+) x (\d+)/ on: ' + data);
          }
          xrandr.kill('SIGHUP');
        });
        // on error
        xrandr.stderr.on('data', function (data) {
          callback(data);
          xrandr.kill('SIGHUP');
        });

      } else {
        var screen = this._page.evaluate(function () {
          return {
            width: screen.width,
            height: screen.height
          };
        });
        this.setSize(screen.width, screen.height);
        callback(null);
      }
    }

    return maximize;

  }();*/

  window.focus = function () {
    return this._page.switchToMainFrame();
  };

  /*
  window.__defineGetter__('localStorage', function () {
    return new _Storage(this, 'local');
  });

  window.__defineGetter__('sessionStorage', function () {
    return new _Storage(this, 'session');
  });*/


  window.activeElement = function() {
    var result = this.eval('active_element');
    if (result.status === 0) {
      return result.value;
    }
  };

  window.frames = function (nameOrId) {
    var self = this,
        frames = this._page.framesName;
    if (nameOrId === null) {
      return this;
    } else if (frames.length > 0 && nameOrId !== undefined &&
      (frames.indexOf(nameOrId) !== -1 || frames[nameOrId] !== undefined)) {
      return {
        focus: function () {
          return self._page.switchToFrame(nameOrId);
        }
      };
    }
  };

  window.back = function () {
    var wait = this.wait.load();
    if (this._page.canGoBack) {
      this._page.goBack();
    } else {
      wait.off('load', 'success');
    }
    return wait;
  };

  window.forward = function () {
    var wait = this.wait.load();
    if (this._page.canGoForward) {
      this._page.goForward();
    } else {
      wait.off('load', 'success');
    }
    return wait;
  };

  /*
  window.sendEvent = function () {
    return this._page.sendEvent.apply(this._page, _slice.call(arguments, 0));
  };*/

  window.__defineGetter__('loading', function() {
    return this._page.loading;
  });

  window.__defineGetter__('url', function () {
    var result = this.eval('execute_script', 'return location.toString()');
    return result.status === 0 ? result.value : result;
  });

  window.executeScript = function (script, args) {
    return this.eval('execute_script', script, args);
  };

  window.executeAsyncScript = function (script, args, timeout) {
    return this.eval('execute_async_script', script, args, timeout);
  };


  /*
  window.mouseMove = function (element, coords) {
    this.mouseCoords = coords;
    return this.eval('move_mouse', element, this.mouseCoords);
  };

  window.click = function (element, button) {
    var command = button === 2 ? 'right_click' :
                                      (button === 1 ? 'scroll_mouse' : 'click');
    console.log(command);
    var result = this.eval(command, element, {
        x: this.mouse.x,
        y: this.mouse.y
      }),
      wait = this.wait.load();
    console.log('RESULT: ' + JSON.stringify(result));
    if (result.status !== 0) {
      this.wait.off('load', 'fail', result);
    } else {
      this.wait.off('load', 'success');
    }
    return wait;
  };

  window.findBody = function (timeout, success, failure) {
    var locator = {using: 'tagName', value: 'body'};
    this.find(locator).wait(timeout, function(result) {
        console.log(JSON.stringify(result));
      if (result.status === 0 && result.value !== null) {
        success.call(this, result.value);
      } else {
        failure.call(this, result);
      }
    });
  };*/

})(Window.prototype);

module.exports = Window;