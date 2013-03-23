module.exports = function (window, session, request, response) {
  var params = request.getParams();
  if (params.script === undefined) {
    response.error.missingCommandParameter('script', request);
  } else if(params.args === undefined) {
    response.error.missingCommandParameter('args', request);
  } else {
    console.log(JSON.stringify(request));

    window.on('callback', function(result) {
      console.log(result);
      response.basedOnResult(result, session, request);
    });
    window.eval(
      'execute_async_script',
      params.script,
      params.args,
      session.getAsyncScriptTimeout()
    );
  }
};