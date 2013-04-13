module.exports = function (element, session, request, response) {
  var other = request.getChunk(6);
  return element.equal(other);
};