module.exports = function (window, session, request, response) {
  var params = request.getParams(),
      width = parseInt(params.width, 10),
      height = parseInt(params.height, 10);
  if (isNaN(width)) {
    response.error.missingCommandParameter('width', request);
  } else if(isNaN(height)) {
    response.error.missingCommandParameter('height', request);
  } else {
    window.setSize(width, height);
    response.success(session.getId());
  }
};