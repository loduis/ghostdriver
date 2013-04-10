module.exports = function (element, session, request, response) {
  var name = request.getChunk(6);
  return element.getAttribute(name);
};