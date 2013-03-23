module.exports = function (window, session, request, response) {
  window.reload().wait(session.getPageLoadTimeout(),
    function () {
      response.success(session.getId());
    },
    function () {
      response.error.timeout(
        'Not can reload the url ' + url,
        session,
        request
      );
    }
  );
};