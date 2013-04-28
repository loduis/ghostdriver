module.exports = function (element, session, request, response) {
  response.basedOnResult(
    element.getText(),
    session,
    request
  );
};