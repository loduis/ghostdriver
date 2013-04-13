module.exports = function(window, session, request, response) {
  var button = request.getParam('button');
  button = button === undefined ? 0 : parseInt(button, 10);
  if (isNaN(button)) {
    response.error.missingCommandParameter('button', request);
  } else {
    window.mouse.down(button);
    response.success(session.getId());
  }
};