module.exports = function (element, session, request, response) {
  response.basedOnResult(
    element.getLocationInView(),
    session,
    request
  );
};