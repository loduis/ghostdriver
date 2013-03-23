module.exports = function(window, session, request, response) {
  var url = request.getParam('url');
  if (url === undefined) {
    response.error.missingCommandParameter('url', request);
  } else {
    window.open(url).wait(session.getPageLoadTimeout(),
      function () {
        response.success(session.getId());
      },
      function () {
        response.error.timeout(
          'Not can load the url ' + url,
          session,
          request
        );
      }
    );
  }
};