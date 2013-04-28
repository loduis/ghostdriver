module.exports = function (window, session, request, response) {
  var params = request.getParams();
  if (params.script === undefined) {
    response.error.missingCommandParameter('script', request);
  } else if(params.args === undefined) {
    response.error.missingCommandParameter('args', request);
  } else {
    var
      timeout = false,
      wait   = session.getScriptTimeout(),
      timeId = setTimeout(function() {
        timeout = true;
        response.error.timeout(
          "Script didn't return within " +  wait + "ms",
          session,
          request
        );
      }, wait);

    var result = window.executeScript(params.script, params.args);

    clearTimeout(timeId);

    if (!timeout) {
      response.basedOnResult(
        result,
        session,
        request
      );
    }
  }
};