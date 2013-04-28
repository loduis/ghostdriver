module.exports = function(window, session, request, response) {
  response.basedOnResult(
    window.activeElement(),
    session,
    request
  );
};