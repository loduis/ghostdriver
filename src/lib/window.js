require ('./core');

var _WebPage  = require('webpage'),
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

  // instance for manage alert.
  this.alert    = new _Alert(this);

  //============ EVENT ==============//

  // event on load stared
  this.on('loadStarted', function () {
    this._page.loading = true; // fixed for phantomjs 1.8.x
  });
  // event load finished
  this.on('loadFinished', function (status) {
    this._page.loading = false;
    this.fire('load', status);
  });

  this.on('callback', function (result) {
    this.fire('result', JSON.parse(result));
  });

  this.on('consoleMessage', function (msg) {
    console.log('MESSAGE: ' + msg);
  });
}

(function (window){
  var
  _slice = Array.prototype.slice,
  _requireAtoms = require('./atoms'),
  _capitalize = function (word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
  };

  // instance of wait
  _defineGetter(window, 'wait', function (Wait) {
    return new Wait(this);
  });

  // instance for manage event mouse
  _defineGetter(window, 'event', function (Event) {
    return new Event(this._page);
  });

  // instance of keyboard
  _defineGetter(window, 'keyboard', function (Keyboard) {
    return new Keyboard(this);
  });

  // instance for manage event mouse
  _defineGetter(window, 'mouse', function (Mouse) {
    return new Mouse(this);
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

  window.__defineGetter__('appCacheStatus', function () {
    return this.eval('get_appcache_status');
  });

  window.__defineGetter__('title', function () {
    return this._page.title;
  });

  window.__defineGetter__('source', function () {
    return this._page.frameContent;
  });

  window.__defineGetter__('url', function () {
    return this._page.url;
  });

  window.__defineGetter__('name', function () {
    return this._page.windowName;
  });

  window.__defineGetter__('loading', function() {
    return this._page.loading;
  });

  window.__defineGetter__('url', function () {
    return this.eval('execute_script', 'return location.toString()');
  });

  window.eval = function (name) {
    var args = _slice.call(arguments, 0);
    args[0]  = _requireAtoms(name);
    var result = this._page.evaluate.apply(this._page, args);
    if (result === null && name == 'execute_async_script') {
      // for skip asyn command
      return undefined;
    }
    try {
      result = JSON.parse(result);
    } catch (e) {
      result = {
        status: 13, // OJO THIS IS AN NOT UNKNOW ERROR ATOM EVALAUTION FAIL
        value: {message: e.message}
      };
    }
    if (result.hasOwnProperty('status')) {
      if (result.status === 0) {
        return result.value;
      }
    } else {
      result = {
        status: 13, // OJO THIS IS AN NOT UNKNOW ERROR ATOM EVALAUTION FAIL
        value: {message: result}
      }
    }
    return result;
  };

  window.open = function (url) {
    this._page.stop();
    this.focus();
    this._page.open(url);
    return this.wait.load();
  };

  window.reload = function () {
    this._page.stop();
    this._page.reload();
    return this.wait.load();
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

  window.close = function () {
    this._page.close();
  };


  window.getScreenshot = function () {
    return this._page.renderBase64('png');
  };

  window.on = function (eventName, callback) {
    var self = this;
    eventName = 'on' + _capitalize(eventName);
    //this._page[eventName] = callback.bind(self); # bug phantomjs
    this._page[eventName] = function () {
      callback.apply(self, _slice.call(arguments, 0));
    };
  };

  window.off = function(eventName) {
    delete this._page[eventName];
  };

  window.fire = function(eventName) {
    eventName = 'on' + _capitalize(eventName);
    var callback = this._page[eventName];
    callback.apply(this, _slice.call(arguments, 1));
  };

  window.find = function (locator, context) {
    var execute = this.eval.bind(
      this,
      'find_element',
      locator.using,
      locator.value,
      context
    );
    return this.wait.result(execute);
  };

  window.findAll = function (locator, context) {
    var execute = this.eval.bind(
      this,
      'find_elements',
      locator.using,
      locator.value,
      context
    );
    return this.wait.result(execute);
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

  window.focus = function () {
    return this._page.switchToMainFrame();
  };

  window.activeElement = function() {
    return this.eval('active_element');
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

  window.executeScript = function (script, args) {
    return this.eval('execute_script', script, args);
  };

  window.executeAsyncScript = function (script, args, timeout) {
    return this.eval('execute_async_script', script, args, timeout);
  };

})(Window.prototype);

module.exports = Window;