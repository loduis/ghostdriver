module.exports = function (window, session, request, response) {
  window.maximize(function (error) {
    if (error == null) {
      response.success(session.getId());
    } else {
      response.error.unknownError(
        error,
        session,
        request
      );
    }
  });
};