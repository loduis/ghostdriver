module.exports = function (session, request, response) {
  response.success(
    session.getId(),
    session.getCapabilities()
  );
};