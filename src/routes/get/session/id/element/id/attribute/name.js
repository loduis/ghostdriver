module.exports = function (element, session, request, response) {
  var name = request.getChunk(6);
  response.basedOnResult(
    element.getAttribute(name),
    session,
    request
  );
};