module.exports = function(window, session, request, response) {
  var button = request.getParam('button');
  button = button === undefined ? 0 : parseInt(button, 10);
  if (isNaN(button)) {
    response.error.missingCommandParameter('button', request);
  } else {
    var time = session.getPageLoadTimeout();
    window.mouse.up(button).wait(time, function (status) {
      response.success(session.getId());
    });
  }
};