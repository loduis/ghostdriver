module.exports = function (element, session, request, response) {
  var time = session.getPageLoadTimeout();
  element.submit().wait(time, function (status, result) {
    if (status === 'success') {
      response.success(session.getId());
    } else if (result !== undefined) {
      response.basedOnResult(result);
    } else if (status === 'timeout') {
      response.error.timeout(
        'Submit timed-out',
        session,
        request
      );
    } else {
      response.error.unknownError(
        'Submit failed: ' + status,
        request,
        session
      );
    }
  });
};