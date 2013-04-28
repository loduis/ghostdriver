module.exports = function (element, session, request, response) {
  var other = request.getChunk(6);
  response.basedOnResult(
    element.equal(other),
    session,
    request
  );
};