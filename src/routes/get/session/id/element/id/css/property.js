module.exports = function (element, session, request, response) {
  var property = request.getChunk(6);
  response.basedOnResult(
    element.getStyle(property),
    session,
    request
  );
};