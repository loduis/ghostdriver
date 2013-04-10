module.exports = function (window, session, request, response) {
  var cookie = request.getParam('cookie');
  if (cookie === null || typeof cookie !== 'object') {
    response.error.missingCommandParameter('cookie', request);
  } else {
    // JavaScript deals with Timestamps in "milliseconds since epoch": normalize!
    if (cookie.expiry) {
      cookie.expiry *= 1000;
    }
    var now = new Date().getTime();
    if ((cookie.expiry && cookie.expiry <= now) ||
                                            window.cookie.add(cookie)) {
      response.success(session.getId());
    } else if (window.url.indexOf(cookie.domain) === -1) {
      response.error.invalidCookieDomain(
        "Can only set Cookies for the current domain",
        session,
        request
      );
    } else {
      response.error.unableToSetCookie(
        "Unable to set Cookie",
        session,
        request
      );
    }
  }
};