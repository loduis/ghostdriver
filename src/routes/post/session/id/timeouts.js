module.exports = function (session, request, response) {
  var parmas = request.getParams();
  if (typeof parmas.type === undefined) {
    response.error.missingCommandParameter('type', request);
  } else if (typeof parmas.ms !== 'number') {
    response.error.missingCommandParameter('ms', request);
  } else {
    var TIMEOUT_NAMES = this.Session.TIMEOUT_NAMES;
    switch(parmas.type) {
      case TIMEOUT_NAMES.SCRIPT:
        session.setScriptTimeout(parmas.ms);
        break;
      case TIMEOUT_NAMES.ASYNC_SCRIPT:
        session.setAsyncScriptTimeout(parmas.ms);
        break;
      case TIMEOUT_NAMES.IMPLICIT:
        session.setImplicitTimeout(parmas.ms);
        break;
      case TIMEOUT_NAMES.PAGE_LOAD:
        session.setPageLoadTimeout(parmas.ms);
        break;

    }
    response.success(session.getId());
  }
};