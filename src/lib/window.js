var _WebPage      = require('webpage'),
    _Alert        = require('./alert'),
    _Wait         = require('./wait'),
    _Storage      = require('./storage'),
    _defineGetter = require('./getter'),
    _uuid         = require('./uuid'),
    _slice = Array.prototype.slice;

function _capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

function Window(settings, page) {
  // page instance
  this._page = page || _WebPage.create();
  // Pages lifetime will be managed by Driver, not the pages
  this._page.ownsPages = false;
  // resource
  this._resources = {};
  this._loading = false;
  // 1. Random Window Handle
  this.handle = _uuid();
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

  var self = this, timerId;

  this.on = function (eventName, callback) {
    var isCustom = eventName.indexOf(':') === 0;
    if (isCustom) {
      eventName = eventName.slice(1);
    }
    // var self = this; other orible phantomjs bug
    eventName = 'on' + _capitalize(eventName);
    // this._page[eventName] = callback.bind(this);// bug phantomjs
    if (isCustom) {
      this[eventName] = callback.bind(this);
    } else {
      this._page[eventName] = function () {
         // return is need for onFilePicker
        return callback.apply(self, _slice.call(arguments, 0));
      };
    }
  };

  // instance for manage alert.
  this.alert    = new _Alert(this);

  this.wait     = new _Wait(this);
  /*
  _defineGetter(this, 'wait', function (Wait) {
    return new Wait(this);
  });*/

  // instance for manage event mouse
  _defineGetter(this, 'event', function (Event) {
    return new Event(this._page);
  });

  // instance of keyboard
  _defineGetter(this, 'keyboard', function (Keyboard) {
    return new Keyboard(this);
  });

  // instance for manage event mouse
  _defineGetter(this, 'mouse', function (Mouse) {
    return new Mouse(this);
  });

  // instance for manage cookie
  _defineGetter(this, 'cookie', function (Cookie) {
    return new Cookie(this._page);
  });

  /*
  // instance for manage local storage
  _defineGetter(this, 'localStorage', 'storage', function (Storage) {
    return new Storage(this, 'local');
  });

  _defineGetter(this, 'sessionStorage', 'storage', function (Storage) {
    return new Storage(this, 'session');
  });
  */

  _defineGetter(this, 'Element', function (Element) {
    return Element.bind(null, this);
  });

  _defineGetter(this, 'maximize', function (maximize) {
    return maximize;
  });

  //============ EVENT ==============//


  this.on('callback', function (result) {
    this.fire('result', JSON.parse(result));
  });

  this.on('consoleMessage', function (msg) {
    console.log('MESSAGE: ' + msg);
  });

  this.on('error', function (msg, stack) {
    console.log('ERROR: ' + msg);
    var error;
    stack.forEach(function(item) {
        error += item.file + ":" + item.line;
        error += (item["function"] ? " in " + item["function"] : "") + "\n";
    });
    console.log('STACK: ' + error);
    this.render();
    phantom.exit(1);
  });
}

(function (window){
  var
  _requireAtoms = require('./atoms'),
  _classSelectorRE = /^\.([\w-]+)$/,
  _idSelectorRE = /^#([\w-]*)$/,
  _tagSelectorRE = /^[\w-]+$/,
  _getLocator =  function (selector) {
    var locator = {
      value: selector,
      using: 'css'
    };
    if (_classSelectorRE.test(selector)) {
      locator.value = selector.slice(1);
      locator.using = 'className';
    } else if (_tagSelectorRE.test(selector)) {
      locator.using = 'tagName';
    } else if(_idSelectorRE.test(selector)) {
      locator.value = selector.slice(1);
      locator.using = 'id';
    }
    return locator;
  };

  window.__defineGetter__('appCacheStatus', function () {
    return this.executeAtomScript('get_appcache_status');
  });

  window.getTitle = function() {
    return this.wait.stop(function() {
      return this._page.title;
    });
  };

  window.getPageSource = function() {
    return this.wait.stop(function () {
      return this._page.frameContent;
    });
  };

  window.getCurrentUrl = function() {
    return this.wait.stop(function () {
      return this._page.url;
    });
  };

  window.localStorage = function() {
    return new _Storage(this, 'local');
  };

  window.sessionStorage = function() {
    return new _Storage(this, 'session');
  };

  window.__defineGetter__('name', function () {
    return this._page.windowName;
  });

  window.__defineGetter__('loading', function () {
    try {
      return this._isLoading() || this._page.loading;
    } catch (e) {
      if (e.message.indexOf('deleted QObject') === -1) {
        throw e;
      }
      return false;
    }
  });

  window.executeAtomScript = function (name) {
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
      };
    }
    return result;
  };

  window.waitForStopAndExecuteAtomScript = function() {
    var args = _slice.call(arguments);
    return this.wait.stop(function () {
      return this.executeAtomScript.apply(this, args);
    });
  };

  window._isLoading = function () {
    var res, id;
    for (id in this._resources) {
      res = this._resources[id];
      if (res.status === -1) {
        return true;
      } else {
        delete this._resources[id];
      }
    }
    return false;
  };

  window.open = function (url) {
    return this.wait.load(function() {
      this._page.open(url);
    });
  };

  window.reload = function () {
    return this.wait.load(function() {
      this._page.reload();
    });
  };

  window.back = function () {
    var callback;
    if (this._page.canGoBack) {
      callback = function () {
        this._page.goBack();
      };
    }
    return this.wait.history(callback);
  };

  window.forward = function () {
    var callback;
    if (this._page.canGoForward) {
      callback = function () {
        this._page.goForward();
      };
    }
    return this.wait.history(callback);
  };

  window.takeScreenshot = function () {
    return this.wait.stop(function() {
      return this.getScreenshot();
    });
  };

  window.getScreenshot = function() {
    return this._page.renderBase64('png');
  };

  window.getSize = function () {
    return this.wait.stop(function() {
      return this._page.viewportSize;
    });
  };

  window.setSize = function (width, height) {
    return this.wait.stop(function() {
      this._page.viewportSize = {
          width : width,
          height : height
      };
    });
  };

  window.getPosition = function () {
    return this.wait.stop(function() {
      return this._position;
    });
  };

  window.setPosition = function (x, y) {
    return this.wait.stop(function() {
      this._position = {
        x: x,
        y: y
      };
    });
  };

  window.focus = function () {
    return this.wait.stop(function() {
      return this._page.switchToMainFrame() === undefined;
    });
  };

  window.activeElement = function() {
    return this.waitForStopAndExecuteAtomScript('active_element');
  };

  window.close = function () {
    this._page.close();
  };

  window.render = function(name) {
    this._page.render((name || this.handle) + '.png');
  };

  window.off = function(eventName) {
    eventName = 'on' + _capitalize(eventName);
    // for delete with link
    try {
      this._page[eventName] = null;
    } catch (e) {
      if (e.message.indexOf('deleted QObject') === -1) {
        throw e;
      }
    }
    this[eventName]       = null;
  };

  window.fire = function(eventName) {
    eventName = 'on' + _capitalize(eventName);
    if (typeof this[eventName] === 'function') {
      var callback = this[eventName];
      callback.apply(this, _slice.call(arguments, 1));
    }
  };

  window.find = function (locator, context) {
    if (typeof locator === 'string') {
      locator = _getLocator(locator);
    }
    var execute = this.executeAtomScript.bind(
      this,
      'find_element',
      locator.using,
      locator.value,
      context
    );
    return this.wait.result(execute);
  };

  window.findAll = function (locator, context) {
    if (typeof locator === 'string') {
      locator = _getLocator(locator);
    }
    var execute = this.executeAtomScript.bind(
      this,
      'find_elements',
      locator.using,
      locator.value,
      context
    );
    return this.wait.result(execute);
  };


  window.frame = function (nameOrId) {
    return this.wait.stop(function() {
      var frames = this._page.framesName,
          self = this;
      if (nameOrId === null) {
        return {
          focus: function () {
            return self._page.switchToMainFrame();
          }
        };
      } else if (frames.length > 0 && nameOrId !== undefined) {
        if (typeof(nameOrId) === 'object' && 'ELEMENT' in nameOrId) {
          nameOrId  = this.executeAtomScript('get_frame_index', nameOrId);
        }
        // si no existe el frame
        if (!(nameOrId !== null &&
          (frames.indexOf(nameOrId) !== -1 || frames[nameOrId] !== undefined))) {
          return;
        }
        return {
          focus: function () {
            return self._page.switchToFrame(nameOrId);
          }
        };
      }
    });
  };

  window.executeScript = function (script, args) {
    return this.waitForStopAndExecuteAtomScript(
      'execute_script',
      script,
      args
    );
  };

  window.executeAsyncScript = function (script, args, timeout, done) {
    return this.wait.stop(function() {
      this.on(':result', function(result) {
        done.call(this, result);
        this.off('result');
      });
      this.executeAtomScript(
        'execute_async_script',
        script,
        args,
        timeout,
        callPhantom
      );
    });
  };

  window.execute = function(script, args) {
    return this.executeAtomScript(
      'execute_script',
      script,
      args
    );
  };

})(Window.prototype);

module.exports = Window;