var
  system = require('system'),
  ghostdriver = {
    version: '2.0',
    os: system.os,
    Session: require('./session')
  },
  router = require('./router');

ghostdriver.args = function (args) {
  var
    ip   = '127.0.0.1',
    port = 8910,
    hub  = null;

  // Check if parameters were given, regarding the "ip:port" to listen to
  if (args[1]) {
      if (args[1].indexOf(':') >= 0) {
          var listen = args[1].split(':');
          ip = listen[0];
          port = listen[1];
      } else {
          port = args[1];
      }
  }

  if (args[2]) {
    hub = args[2];
  }

  return {
    ip: ip,
    port: port,
    hub: hub
  };

}(system.args);

ghostdriver.registerHub = function () {
  if (this.args.hub) {
    var hub = null;
    ghostdriver.register(hub);
  }
};


ghostdriver.start = function () {
  var server   = require('webserver').create(),
      listen   = server.listen(this.args.port, router.dispatch);
  if (listen) {
    this.registerHub();
  }
  return listen;
};

module.exports = ghostdriver;