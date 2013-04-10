module.exports = function(window, session, request, response) {
  var time = session.getPageLoadTimeout();
  window.back().wait(time, function (status) {
    if (status === 'success') {
      response.success(session.getId());
    } else {
      response.error.timeout(
        'Not can back to history',
        session,
        request
      );
    }
  });
};