var
  _uuid = require('./uuid'),
  _Window = require('./window'),
  _sessions = {},
  _system = require('system'),
  _defaultCapabilities = {    // TODO - Actually try to match the 'desiredCapabilities' instead of ignoring them
    'browserName' : 'phantomjs',
    'version' : phantom.version.major + '.' + phantom.version.minor + '.' +
                phantom.version.patch,
    'driverName' : 'ghostdriver',
    'platform' : _system.os.name + '-' + _system.os.version + '-' +
                 _system.os.architecture,
    'javascriptEnabled' : true,
    'takesScreenshot' : true,
    'handlesAlerts' : false,            //< TODO
    'databaseEnabled' : false,          //< TODO
    'locationContextEnabled' : false,   //< TODO Target is 1.1
    'applicationCacheEnabled' : false,  //< TODO Support for AppCache (?)
    'browserConnectionEnabled' : false, //< TODO
    'cssSelectorsEnabled' : true,
    'webStorageEnabled' : false,        //< TODO support for LocalStorage/SessionStorage
    'rotatable' : false,                //< TODO Target is 1.1
    'acceptSslCerts' : false,           //< TODO
    'nativeEvents' : true,              //< TODO Only some commands are Native Events currently
    'proxy' : {                         //< TODO Support more proxy options - PhantomJS does allow setting from command line
        'proxyType' : 'direct'
    }
  },
  _capsPageSettingsPref = "phantomjs.page.settings.",
  _TIMEOUT_NAMES = {
      SCRIPT          : "script",
      ASYNC_SCRIPT    : "async script",
      IMPLICIT        : "implicit",
      PAGE_LOAD       : "page load"
  },
  _max32bitInt = Math.pow(2, 31) -1;

function _getCap(desiredCapabilities, property) {
  return typeof(desiredCapabilities[property]) === 'undefined' ?
          _defaultCapabilities[property] :
          desiredCapabilities[property];
}

function _setTimeout(timeouts, type, ms) {
  // In case the chosen timeout is less than 0, we reset it to `_max32bitInt`
  if (ms < 0) {
      timeouts[type] = _max32bitInt;
  } else {
      timeouts[type] = ms;
  }
}

function Session(desiredCapabilities) {
  // ghostdriver is active here
  _defaultCapabilities['driverVersion'] = ghostdriver.version;
  var id = _uuid(),
      negotiatedCapabilities = {
        'browserName'               : _defaultCapabilities.browserName,
        'version'                   : _defaultCapabilities.version,
        'platform'                  : _defaultCapabilities.platform,
        'javascriptEnabled'         : _getCap(desiredCapabilities, 'javascriptEnabled'),
        'takesScreenshot'           : _getCap(desiredCapabilities, 'takesScreenshot'),
        'handlesAlerts'             : _defaultCapabilities.handlesAlerts,
        'databaseEnabled'           : _defaultCapabilities.databaseEnabled,
        'locationContextEnabled'    : _defaultCapabilities.locationContextEnabled,
        'applicationCacheEnabled'   : _defaultCapabilities.applicationCacheEnabled,
        'browserConnectionEnabled'  : _defaultCapabilities.browserConnectionEnabled,
        'cssSelectorsEnabled'       : _defaultCapabilities.cssSelectorsEnabled,
        'webStorageEnabled'         : _defaultCapabilities.webStorageEnabled,
        'rotatable'                 : _defaultCapabilities.rotatable,
        'acceptSslCerts'            : _defaultCapabilities.acceptSslCerts,
        'nativeEvents'              : _defaultCapabilities.nativeEvents,
        'proxy'                     : _getCap(desiredCapabilities, 'proxy')
      },
      pageSettings = {},
      windows = {},
      timeouts = {};

  for (var k in desiredCapabilities) {
      if (k.indexOf(_capsPageSettingsPref) === 0) {
          settingKey = k.substring(_capsPageSettingsPref.length);
          if (settingKey.length > 0) {
              negotiatedCapabilities[k] = desiredCapabilities[k];
              pageSettings[settingKey] = desiredCapabilities[k];
          }
      }
  }
  // set time outs
  for (k in _TIMEOUT_NAMES) {
    timeouts[_TIMEOUT_NAMES[k]] = _max32bitInt;
  }
  timeouts[_TIMEOUT_NAMES.IMPLICIT] = 5;

  var currentWindowHandle = _uuid(),
      window = new _Window(currentWindowHandle, pageSettings);

  windows[currentWindowHandle] = window;

  window.on('closing', function () {
    var handle = this.handle;
    if (windows.hasOwnProperty(handle)) {
      delete windows[this.handle];
    }
  });

  // handle new page pop up
  window.on('pageCreated', function (page) {
    var handle = _uuid();
        window = new _Window(handle, pageSettings, page);
    windows[handle] = window;
  });


  this.getId = function () {
    return id;
  };

  this.getCapabilities = function () {
    return negotiatedCapabilities;
  };
  this.getCurrentWindowHandle = function() {
    return currentWindowHandle;
  };

  this.getWindowHandles = function() {
    return Object.keys(windows);
  };

  this.getWindow = function (handle) {
    handle = handle === undefined || handle === 'current' ?
              this.getCurrentWindowHandle() : handle;
    var window = windows.hasOwnProperty(handle) ? windows[handle] : null;
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

  this.switchToWindow = function(handle) {
    var window = this.getWindow(handle), change = false;
    if (window !== null) {
      currentWindowHandle = window.handle;
      window.focus();
      change = true;
    }
    return change;
  };


  this.setPageLoadTimeout = function (ms) {
    _setTimeout(timeouts, _TIMEOUT_NAMES.PAGE_LOAD, ms);
  };

  this.setImplicitTimeout = function(ms) {
    _setTimeout(timeouts, _TIMEOUT_NAMES.IMPLICIT, ms);
  };

  this.setScriptTimeout = function(ms) {
    _setTimeout(timeouts, _TIMEOUT_NAMES.SCRIPT, ms);
  };

  this.setAsyncScriptTimeout = function(ms) {
    _setTimeout(timeouts, _TIMEOUT_NAMES.ASYNC_SCRIPT, ms);
  };

  this.getPageLoadTimeout = function () {
    return timeouts[_TIMEOUT_NAMES.PAGE_LOAD];
  };

  this.getImplicitTimeout = function() {
    return timeouts[_TIMEOUT_NAMES.IMPLICIT];
  };

  this.getScriptTimeout = function() {
    return timeouts[_TIMEOUT_NAMES.SCRIPT];
  };

  this.getAsyncScriptTimeout = function() {
    return timeouts[_TIMEOUT_NAMES.ASYNC_SCRIPT];
  };

  this.close = function () {
    var id = this.getId();
    for (var handle in windows) {
      windows[handle].close();
    }
    delete _sessions[this.getId()];
    return id;
  };


}

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