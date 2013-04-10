module.exports = function (element, session, request, response) {
  var property = request.getChunk(6);
  return element.getStyle(property);
};