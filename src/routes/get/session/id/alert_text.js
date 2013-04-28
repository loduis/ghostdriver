module.exports = function(window, session, request, response) {
  response.basedOnResult(
    window.alert.text,
    session,
    request
  );
};
