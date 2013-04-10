module.exports = function (window, session, request, response) {
  var params = request.getParams();
  if (params.script === undefined) {
    response.error.missingCommandParameter('script', request);
  } else if(params.args === undefined) {
    response.error.missingCommandParameter('args', request);
  } else {
    window.on('callback', function(result) {
      response.basedOnResult(result, session, request);
    });
    window.executeAsyncScript(
      params.script,
      params.args,
      session.getAsyncScriptTimeout()
    );
  }
};