module.exports = function(element, session, request, response) {
  response.success(
    session.getId(),
    element.getId()
  );
};