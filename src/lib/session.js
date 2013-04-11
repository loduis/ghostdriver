const
  _uuid = require('./uuid'),
  _Window = require('./window'),
  _capsPageSettingsPref = "phantomjs.page.settings.",
  _TIMEOUT_NAMES = {
      SCRIPT          : "script",
      ASYNC_SCRIPT    : "async script",
      IMPLICIT        : "implicit",
      PAGE_LOAD       : "page load"
  },
  _max32bitInt = Math.pow(2, 31) -1,
  _defaultCapabilities = {    // TODO - Actually try to match the 'desiredCapabilities' instead of ignoring them
    browserName              : 'phantomjs',
    version                  : phantom.version.major + '.' +
                               phantom.version.minor + '.' +
                               phantom.version.patch,
    driverName               : 'ghostdriver',
    platform                 : ghostdriver.os.name + '-' +
                               ghostdriver.os.version + '-' +
                               ghostdriver.os.architecture,
    driverVersion            : ghostdriver.driverVersion,
    javascriptEnabled        : true,
    takesScreenshot          : true,
    handlesAlerts            : false,            //< TODO
    databaseEnabled          : false,          //< TODO
    locationContextEnabled   : false,   //< TODO Target is 1.1
    applicationCacheEnabled  : false,  //< TODO Support for AppCache (?)
    browserConnectionEnabled : false, //< TODO
    cssSelectorsEnabled      : true,
    webStorageEnabled        : true,        //< TODO support for LocalStorage/SessionStorage
    rotatable                : false,                //< TODO Target is 1.1
    acceptSslCerts           : false,           //< TODO
    nativeEvents             : true,              //< TODO Only some commands are Native Events currently
    proxy : {                         //< TODO Support more proxy options - PhantomJS does allow setting from command line
        proxyType : 'direct'
    }
  };

var _sessions = {};


function _getCap(desiredCapabilities, property) {
  return typeof(desiredCapabilities[property]) === 'undefined' ?
          _defaultCapabilities[property] :
          desiredCapabilities[property];
}

function Session(desiredCapabilities) {
  _defaultCapabilities['driverVersion'] = ghostdriver.version;
  this._id = _uuid();
  this._windows = {};
  this._timeouts = {};
  this._negotiatedCapabilities = {
    browserName              : _defaultCapabilities.browserName,
    version                  : _defaultCapabilities.version,
    platform                 : _defaultCapabilities.platform,
    javascriptEnabled        : _getCap(desiredCapabilities, 'javascriptEnabled'),
    takesScreenshot          : _getCap(desiredCapabilities, 'takesScreenshot'),
    handlesAlerts            : _defaultCapabilities.handlesAlerts,
    databaseEnabled          : _defaultCapabilities.databaseEnabled,
    locationContextEnabled   : _defaultCapabilities.locationContextEnabled,
    applicationCacheEnabled  : _defaultCapabilities.applicationCacheEnabled,
    browserConnectionEnabled : _defaultCapabilities.browserConnectionEnabled,
    cssSelectorsEnabled      : _defaultCapabilities.cssSelectorsEnabled,
    webStorageEnabled        : _defaultCapabilities.webStorageEnabled,
    rotatable                : _defaultCapabilities.rotatable,
    acceptSslCerts           : _defaultCapabilities.acceptSslCerts,
    nativeEvents             : _defaultCapabilities.nativeEvents,
    proxy                    : _getCap(desiredCapabilities, 'proxy')
  };

  var pageSettings = {};

  for (var k in desiredCapabilities) {
      if (k.indexOf(_capsPageSettingsPref) === 0) {
          settingKey = k.substring(_capsPageSettingsPref.length);
          if (settingKey.length > 0) {
              this._negotiatedCapabilities[k] = desiredCapabilities[k];
              pageSettings[settingKey] = desiredCapabilities[k];
          }
      }
  }

  // set time outs
  for (var k in _TIMEOUT_NAMES) {
    this._timeouts[_TIMEOUT_NAMES[k]] = _max32bitInt;
  }

  this._timeouts[_TIMEOUT_NAMES.IMPLICIT] = 5;

  this._currentWindowHandle = _uuid();

  var window = new _Window(this._currentWindowHandle, pageSettings),
     self = this;

  window.on('closing', function () {
    var handle = this.handle;
    if (self._windows.hasOwnProperty(handle)) {
      delete self._windows[this.handle];
    }
  });

  // handle new page pop up
  window.on('pageCreated', function (page) {
    var handle = _uuid();
        window = new _Window(handle, pageSettings, page);
    self._windows[handle] = window;
  });

  this._windows[this._currentWindowHandle] = window;

}

//=================== INSTANCE METHOD ===================//

(function (session) {

  session.getId = function () {
    return this._id;
  };

  session.getCapabilities = function () {
    return this._negotiatedCapabilities;
  };

  session.getCurrentWindowHandle = function() {
    return this._currentWindowHandle;
  };

  session.getWindowHandles = function() {
    return Object.keys(this._windows);
  };

  session.getWindow = function (handle) {
    handle = handle === undefined || handle === 'current' ?
              this.getCurrentWindowHandle() : handle;
    var windows = this._windows,
        window = windows.hasOwnProperty(handle) ?
                 windows[handle] : null;
    if (window === null) {
      for(var key in windows) {
        if (windows[key].name === handle) {
          window = windows[key];
          break;
        }
      }
    }
    return window;
  };

  session.switchToWindow = function(handle) {
    var window = this.getWindow(handle), change = false;
    if (window !== null) {
      this._currentWindowHandle = window.handle;
      window.focus();
      change = true;
    }
    return change;
  };

  session.setPageLoadTimeout = function (ms) {
    this._setTimeout(_TIMEOUT_NAMES.PAGE_LOAD, ms);
  };

  session.setImplicitTimeout = function(ms) {
    this._setTimeout(_TIMEOUT_NAMES.IMPLICIT, ms);
  };

  session.setScriptTimeout = function(ms) {
    this._setTimeout(_TIMEOUT_NAMES.SCRIPT, ms);
  };

  session.setAsyncScriptTimeout = function(ms) {
    this._setTimeout(_TIMEOUT_NAMES.ASYNC_SCRIPT, ms);
  };

  session.getPageLoadTimeout = function () {
    return this._timeouts[_TIMEOUT_NAMES.PAGE_LOAD];
  };

  session.getImplicitTimeout = function() {
    return this._timeouts[_TIMEOUT_NAMES.IMPLICIT];
  };

  session.getScriptTimeout = function() {
    return this._timeouts[_TIMEOUT_NAMES.SCRIPT];
  };

  session.getAsyncScriptTimeout = function() {
    return this._timeouts[_TIMEOUT_NAMES.ASYNC_SCRIPT];
  };

  session.close = function () {
    var id = this.getId();
    for (var handle in this._windows) {
      this._windows[handle].close();
    }
    delete _sessions[this.getId()];
    return id;
  };

  session._setTimeout = function(type, ms) {
    // In case the chosen timeout is less than 0, we reset it to `_max32bitInt`
    if (ms < 0) {
        this._timeouts[type] = _max32bitInt;
    } else {
        this._timeouts[type] = ms;
    }
  }

})(Session.prototype);

//=================== CLASS METHOD ===================//

Session.get =  function(id) {
  return _sessions.hasOwnProperty(id) ? _sessions[id] : null;
};

Session.getWindow = function (request, response) {
  var session = Session.get(request, response),
      window = session.getWindow();
  if (window === null) {
    throw response.error.noSuchWindow(
      'the currently selected window has been closed',
      session,
      request
    );
  }
  return window;
};

Session.create = function (desiredCapabilities) {
  var session = new Session(desiredCapabilities);
  _sessions[session.getId()] = session;
  return session;
};

Session.TIMEOUT_NAMES = _TIMEOUT_NAMES;

module.exports = Session;