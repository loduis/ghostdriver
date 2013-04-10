module.exports = function(window, session, request, response) {
  var time = session.getPageLoadTimeout();
  window.mouse.doubleClick().wait(time, function (status) {
    response.success(session.getId());
  });
};