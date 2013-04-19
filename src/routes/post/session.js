module.exports = function (request, response) {
  var desiredCapabilities = request.getParam('desiredCapabilities');
  if(typeof desiredCapabilities === 'object') {
    var session = this.session.create(desiredCapabilities);
    response.redirect(
      303,
      'http://' + request.headers.Host + '/wd/hub/session/' + session.getId()
    );
  } else {
    response.error.missingCommandParameter(
      'desiredCapabilities',
      request
    );
  }
};