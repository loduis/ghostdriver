module.exports = function (element, session, request, response) {
  response.basedOnResult(
    element.getId(),
    session,
    request
  );
};