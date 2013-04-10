module.exports = function (element, session, request, response) {
  var callback = request.getCallback('session/id/elements');
  callback.call(this, element, session, request, response);
};