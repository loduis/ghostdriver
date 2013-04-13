module.exports = function(window, session, request, response) {

  var params = request.getParams(),
      x = 0,
      y = 0;
  if (params.element === undefined) {
    return response.error.missingCommandParameter('element', request);
  }
  if (params.element === null) {
    if (params.xoffset === undefined) {
      return response.error.missingCommandParameter('xoffset', request);
    } else if (params.yoffset === undefined) {
      return response.error.missingCommandParameter('yoffset', request);
    } else {
      x = window.mouse.x + params.xoffset;
      y = window.mouse.y + params.yoffset;
    }
  } else {
    var
      element  = new window.Element(params.element),
      location = element.getLocationInView(),
      size     = element.getSize();
    if (location !== null) {
      x = location.x;
      y = location.y;
    }
    if (params.xoffset || params.yoffset) {
      x += params.xoffset || 0;
      y += params.yoffset || 0;
    } else {
      x += Math.floor(size.width / 2);
      y += Math.floor(size.height / 2);
    }
  }
  window.mouse.move(x, y);
  response.success(session.getId());
};