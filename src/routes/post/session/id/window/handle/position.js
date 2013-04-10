module.exports = function (window, session, request, response) {
  var params = request.getParams(),
      x = parseInt(params.x, 10),
      y = parseInt(params.y, 10);
  if (isNaN(x)) {
    response.error.missingCommandParameter('x', request);
  } else if(isNaN(y)) {
    response.error.missingCommandParameter('y', request);
  } else {
    window.setPosition(x, y);
    response.success(session.getId());
  }
};