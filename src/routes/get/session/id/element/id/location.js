module.exports = function (element, session, request, response) {
  response.basedOnResult(
    element.getLocation(),
    session,
    request
  );
};