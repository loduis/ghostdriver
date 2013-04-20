module.exports = function (request, response) {
  var id = request.getSessionId();
  if (this.session.close(id)) {
    response.success(id);
  } else {
    response.error.variableResourceNotFound(request);
  }
};