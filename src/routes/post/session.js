module.exports = function (request, response) {
  var desiredCapabilities = request.getParam('desiredCapabilities');
  if(typeof desiredCapabilities === 'object') {
    var session = this.Session.create(desiredCapabilities);
    response.statusCode = 303; //< "303 See Other"
    response.setHeader(
      'Location',
      'http://' + request.headers.Host + '/wd/hub/session/' + session.getId()
    );
    response.closeGracefully();
  } else {
    response.error.missingCommandParameter(
      'desiredCapabilities',
      request
    );
  }
};