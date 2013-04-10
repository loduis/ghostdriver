module.exports = function (element, session, request, response) {
  try {
  var other = request.getChunk(6);
  return element.equal(other);
} catch (e) {
  console.log(JSON.stringify(e));
}
};