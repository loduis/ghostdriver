module.exports = function(window, session, request, response) {
  response.basedOnResult(
    window.url,
    session,
    request
  );
};
