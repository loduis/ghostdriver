module.exports = function (element, session, request, response) {
  response.basedOnResult(
    element.isDisplayed(),
    session,
    request
  );
};