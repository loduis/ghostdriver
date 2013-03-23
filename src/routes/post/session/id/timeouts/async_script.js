module.exports = function (session, request, response) {
  var ms = request.getParam('ms');
  if (typeof ms !== 'number') {
    response.error.missingCommandParameter('ms', request);
  } else {
    session.setAsyncScriptTimeout(ms);
    response.success(session.getId());
  }
};