function _create(router) {
  global['router'] = router;
  require('./get');
  require('./post');
  require('./delete');
  router = global['router'];
  delete global['router'];

  return router;
}

exports.create = _create;