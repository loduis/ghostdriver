module.exports = function (element, session, request, response) {
  response.basedOnResult(
    element.clear(),
    session,
    request
  );
};