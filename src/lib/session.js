const
  _uuid = require('./uuid'),
  _Window = require('./window'),
  _capsPageSettingsPref = 'phantomjs.page.settings.',
  _TIMEOUT_NAMES = {
      SCRIPT          : 'script',
      ASYNC_SCRIPT    : 'async script',
      IMPLICIT        : 'implicit',
      PAGE_LOAD       : 'page load'
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

function _getCap(desiredCapabilities, property) {
  return typeof(desiredCapabilities[property]) === 'undefined' ?
          _defaultCapabilities[property] :
          desiredCapabilities[property];
}

function _onClosing(session) {
  var handle = this.handle;
  if (session._windows.hasOwnProperty(handle)) {
    delete session._windows[handle];
  }
}

function _createWindow(session, pageSettings, page) {
  var window = new _Window(pageSettings, page);
  session._windows[window.handle] = window;
  window.on('closing', _onClosing.bind(window, session));

  return window;
}

function Session(desiredCapabilities) {
  desiredCapabilities = desiredCapabilities || {};
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

  var k, pageSettings = {};

  for (k in desiredCapabilities) {
      if (k.indexOf(_capsPageSettingsPref) === 0) {
          settingKey = k.substring(_capsPageSettingsPref.length);
          if (settingKey.length > 0) {
              this._negotiatedCapabilities[k] = desiredCapabilities[k];
              pageSettings[settingKey] = desiredCapabilities[k];
          }
      }
  }

  // set time outs
  for (k in _TIMEOUT_NAMES) {
    this._timeouts[_TIMEOUT_NAMES[k]] = _max32bitInt;
  }

  this._timeouts[_TIMEOUT_NAMES.IMPLICIT] = 5;

  var window = _createWindow(this, pageSettings);

  // handle new page popup
  window.on('pageCreated', _createWindow.bind(window, this, pageSettings));

  this._currentWindowHandle    = window.handle;
}

//=================== INSTANCE METHOD ===================//

(function (session) {

  session.hasAllRequired = function(required) {
    if (required) {
      var negotiated = this._negotiatedCapabilities;
      for (var r in required) {
        if (r in negotiated) {
          if (negotiated[r] !== required[r]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  session.getId = function () {
    return this._id;
  };

  session.getCapabilities = function () {
    return this._negotiatedCapabilities;
  };

  session.getCurrentWindowHandle = function() {
    return this._currentWindowHandle;
  };

  session.setCurrentWindowHandle = function(handle) {
    this._currentWindowHandle = handle;
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
    var window = this.getWindow(handle);
    if (window !== null) {
      this._currentWindowHandle = window.handle;
      window.focus();
    }
    return window;
  };

  session.closeWindow = function (handle) {
    var window = this.getWindow(handle);
    if (window !== null) {
      window.close();
      delete this._windows[window.handle];
      return true;
    }
    return false;
  };

  session.setImplicitTimeout = function(ms) {
    this._setTimeout(_TIMEOUT_NAMES.IMPLICIT, ms);
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

  session.findTimeout = function (type) {
    if (this._timeouts.hasOwnProperty(type)) {
      return this._setTimeout.bind(this, type);
    }
  };

  session.close = function () {
    var id = this.getId();
    for (var handle in this._windows) {
      this._windows[handle].close();
    }
    return id;
  };

  session._setTimeout = function(type, ms) {
    // In case the chosen timeout is less than 0, we reset it to `_max32bitInt`
    if (ms < 0) {
        this._timeouts[type] = _max32bitInt;
    } else {
        this._timeouts[type] = ms;
    }
  };

})(Session.prototype);

module.exports = Session;