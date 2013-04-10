module.exports = function (element, session, request, response) {
  var time = session.getPageLoadTimeout();
  element.click().wait(time, function (status, result) {
    if (status === 'success') {
      response.success(session.getId());
    } else if (result !== undefined) {
      response.baseOnResult(result, session, request);
    } else if (status === 'timeout') {
      response.error.timeout(
        'Click timed-out',
        session,
        request
      );
    } else {
      response.error.unknownError(
        'Click failed: ' + status,
        request,
        session
      );
    }
  });
};