module.exports = function (session, request, response) {
  var name = request.getParam('name');
  if (session.closeWindow(name)) {
    response.success(session.getId());
  } else {
    response.error.noSuchWindow(
      'Unable to close window (closed already?)',
      session,
      request
    );
  }
};