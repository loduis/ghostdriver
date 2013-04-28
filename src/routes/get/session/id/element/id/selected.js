module.exports = function (element, session, request, response) {
  response.basedOnResult(
    element.isSelected(),
    session,
    request
  );
};