require ('./core');
var
  system = require('system'),
  ghostdriver = {
    version: '2.0',
    os: system.os
  },
  router = require('./router');

ghostdriver.args = function (args) {
  var
    config = {
      ip  : '127.0.0.1',
      port: 8910,
      hub : null
    },
    i = args.length,
    regexp = new RegExp("^--([a-z]+)=([a-z0-9_/\\\\:.]+)$", "i"),
    result;
  while (i --) {
    result = regexp.exec(args[i]);
    if (result !== null &&
        result.length === 3 &&
        config.hasOwnProperty(result[1])
    ) {
      config[result[1]] = result[2];
    }
  }

  return config;
}(system.args);

ghostdriver.session = function () {

  var Session, _sessions = {};

  function create(desiredCapabilities) {
    Session = Session || require('./session');
    var session = new Session(desiredCapabilities);
    _sessions[session.getId()] = session;
    return session;
  }

  function get(id) {
    return _sessions.hasOwnProperty(id) ? _sessions[id] : null;
  }

  function all() {
    var sessions = [];
    for (var id in _sessions) {
        sessions.push({
          id : id,
          capabilities : _sessions[id].getCapabilities()
        });
    }
    return sessions;
  }

  function close(session) {
    // if type is string is the id
    if (typeof session === 'string') {
      session = this.get(session);
    }
    if (session !== null) {
      var id = session.close();
      delete _sessions[id];
      return true;
    }
    return false;
  }

  return {
    create: create,
    get: get,
    all: all,
    close: close
  };
}();

ghostdriver.hub = function () {
  var _register;
  function register() {
    var args = ghostdriver.args;
    _register = _register || require('./hub');
    return _register(args.ip, args.port, args.hub);
  }

  return {
    register: register
  };
}();

ghostdriver.start = function (message) {
  var server   = require('webserver').create(),
      listen   = server.listen(this.args.port, router.dispatch);
  if (listen) {
    if (server.port !== this.args.port) {
      this.args.port = server.port;
    }
    if (this.args.hub) {
      this.hub.register();
    }
  } else {
    this.stop('ERROR: Could not start Ghost Driver');
  }

  this.log('Ghost Driver running on port ' + this.args.port);

  return listen;
};

ghostdriver.stop = function (message) {
  if (message) {
    console.log(message);
  }
  phantom.exit(1);
};

ghostdriver.log = function (message) {
  console.log(message);
};

module.exports = ghostdriver;