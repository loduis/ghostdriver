/*
module.exports = function(window, session, request, response) {
  try {
  var params = request.getParams(),
      coords = {
        x: 0,
        y: 0
      };
  if (params.element === undefined) {
    return response.error.missingCommandParameter('element', request);
  }
  if (params.element === null) {
    if (params.xoffset === undefined) {
      return response.error.missingCommandParameter('xoffset', request);
    } else if (params.yoffset === undefined) {
      return response.error.missingCommandParameter('yoffset', request);
    } else {
      coords.x += params.xoffset;
      coords.y += params.yoffset;
      var time    = session.getImplicitTimeout();

      window.findBody(time, function (id) {
          var time = session.getPageLoadTimeout(),
              element = new window.Element(id);
          try {
            var result = element.getLocationInView();
            console.log(JSON.stringify(result));
          } catch (e) {
            console.log(JSON.stringify(e));
          }
          result = element.mouseMove(coords);
          if (result.status !== 0) {
            response.basedOnResult(result, session, request);
          } else {
            response.success(session.getId());
          }
        }, function (result) {
          if (result.value === null) {
            result.status = response.error.NO_SUCH_ELEMENT;
            result.value = {message: 'No Such Element found'};
          } else {
            result.status = response.error.translateDomErrorCode(result.status);
          }
          response.basedOnResult(result, session, request);
        }
      );
    }
  } else {
    var
      element  = new window.Element(params.element),
      size     = element.getSize();
    if (params.xoffset || params.yoffset) {
      coords.x += params.xoffset || 0;
      coords.y += params.yoffset || 0;
    } else {
      coords.x += Math.floor(size.width / 2);
      coords.y += Math.floor(size.height / 2);
    }
    element.mouseMove(coords);
    response.success(session.getId());
  }
} catch (e) {
  console.log(JSON.stringify(e));
}
};*/

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
  console.log('X: ' + window.mouse.x);
  console.log('Y: ' + window.mouse.y);
  response.success(session.getId());
};