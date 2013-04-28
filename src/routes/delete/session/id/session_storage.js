module.exports = function (window, session, request, response) {
  response.basedOnResult(
    window.sessionStorage.clear(),
    session,
    request
  );
};