module.exports = function(window, session, request, response) {
  var time = session.getPageLoadTimeout();
  window.forward().wait(time, function (status) {
    if (status === 'success') {
      response.success(session.getId());
    } else {
      response.error.timeout(
        'Not can forward to history',
        session,
        request
      );
    }
  });
};