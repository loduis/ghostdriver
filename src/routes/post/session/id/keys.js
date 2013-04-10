module.exports = function (window, session, request, response) {
  var id = window.activeElement(),
      element = new window.Element(id),
      callback = request.getCallback('session/id/element/id/value');
  element.clearModifiers = false;
  return callback.call(this, element, session, request, response);
};