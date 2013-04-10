module.exports = function(window, session, request, response) {
  var url = request.getParam('url');
  if (url === undefined) {
    response.error.missingCommandParameter('url', request);
  } else {
    var time = session.getPageLoadTimeout();
    window.open(url).wait(time, function (status) {
      if (status === 'success') {
        response.success(session.getId());
      } else {
        response.error.timeout(
          'Not can load the url ' + url,
          session,
          request
        );
      }
    });
  }
};