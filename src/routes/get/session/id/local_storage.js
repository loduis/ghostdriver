module.exports = function (window, session, request, response) {
  response.basedOnResult(
    window.localStorage.keys,
    session,
    request
  );
};