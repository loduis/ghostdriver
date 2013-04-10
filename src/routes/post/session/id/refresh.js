module.exports = function (window, session, request, response) {
  var time = session.getPageLoadTimeout();
  window.reload().wait(time, function (status) {
    if (status === 'success') {
      response.success(session.getId());
    } else {
      response.error.timeout(
        'Not can reload the url ' + this.url,
        session,
        request
      );
    }
  });
};