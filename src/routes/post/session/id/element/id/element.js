module.exports = function (element, session, request, response) {
  var callback = request.getCallback('session/id/element');
  callback.call(this, element, session, request, response);
};