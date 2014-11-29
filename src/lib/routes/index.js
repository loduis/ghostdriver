exports.create = function (router) {

  require('./get')(router);
  require('./post')(router);
  require('./delete')(router);

  return router;
};

