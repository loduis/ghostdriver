var _WebPage      = require('webpage'),
    _Alert        = require('./alert'),
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
  // is loading page.
  this._page.loading = false;
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

  var self = this;

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
        callback.apply(self, _slice.call(arguments, 0));
      };
    }
  };

  // instance for manage alert.
  this.alert    = new _Alert(this);

  // instance of wait
  _defineGetter(this, 'wait', function (Wait) {
    return new Wait(this);
  });

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

  // instance for manage local storage
  _defineGetter(this, 'localStorage', 'storage', function (Storage) {
    return new Storage(this, 'local');
  });

  _defineGetter(this, 'sessionStorage', 'storage', function (Storage) {
    return new Storage(this, 'session');
  });

  _defineGetter(this, 'Element', function (Element) {
    return Element.bind(null, this);
  });

  _defineGetter(this, 'maximize', function (maximize) {
    return maximize;
  });

  //============ EVENT ==============//

  // 1. event on load stared
  this.on('loadStarted', function () {
    this._resources = {};
    this.loading = true;
    this.wait.notify('loading');
  });

  // 2. recibe los recursos
  this.on('resourceReceived', function (resource) {
    if (resource.stage === 'end') {
      if (this._resources !== null) {
        this._resources[resource.url] = resource.status;
      }
      var status = resource.status;
      if (status !== 200) {
        console.log('REVIEW STATUS: ' + status);
      }
    }
  });
  // 3. se cambia la url
  this.on('urlChanged', function (targetUrl) {
    this.loading = true;
    this.wait.notify('loading');
    if (this._resources.hasOwnProperty(targetUrl)) {
      this.statusCode = this._resources[targetUrl];
      this._resources = null; // free memory
    }
  });

  // 4. event load finished
  this.on('loadFinished', function (status) {
    this.loading = false;
    this.fire('load', status);
  });

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

  window.stop = function () {
    this._page.stop();
  };

  window.open = function (url) {
    this.stop();
    this.focus();
    //this._url = url;
    this._page.open(url);
    return this.wait.load();
  };

  window.reload = function () {
    this.stop();
    this.focus();
    this._page.reload();
    return this.wait.load();
  };

  window.back = function () {
    var wait;
    if (this._page.canGoBack) {
      this._page.goBack();
      wait = this.wait.load();
    } else {
      wait = this.wait.load(null);
    }
    return wait;
  };

  window.forward = function () {
    var wait;
    if (this._page.canGoForward) {
      this._page.goForward();
      wait = this.wait.load();
    } else {
      wait = this.wait.load(null);
    }
    return wait;
  };

  window.close = function () {
    this._page.close();
  };

  window.render = function(name) {
    this._page.render((name || this.handle) + '.png');
  };

  window.getScreenshot = function () {
    return this._page.renderBase64('png');
  };

  window.off = function(eventName) {
    eventName = 'on' + _capitalize(eventName);
    this._page[eventName] = null;
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
    return this.executeAtomScript('active_element');
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
    return this.executeAtomScript(
      'execute_script',
      script,
      args
    );
  };

  window.executeAsyncScript = function (script, args, timeout, done) {
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
  };

})(Window.prototype);

module.exports = Window;