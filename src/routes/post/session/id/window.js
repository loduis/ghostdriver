module.exports = function(session, request, response) {
  var name = request.getParam('name');
  if (name === undefined) {
    response.error.missingCommandParameter('name', request);
  } else if (session.switchToWindow(name)) {
      response.success(session.getId());
  } else {
    response.error.noSuchWindow(
      'the currently selected window has been closed',
      session,
      request
    );
  }
};