module.exports = function (window, session, request, response) {
  var id = request.getParam('id');
  if (id === undefined) {
    response.error.missingCommandParameter('id', request);
  } else {
    var frame = window.frames(id);
    if (frame === undefined) {
      response.error.noSuchFrame(
        'the frame could not be found',
        session,
        request
      );
    } else {
      frame.focus();
      response.success(session.getId());
    }
  }
};