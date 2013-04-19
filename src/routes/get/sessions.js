module.exports = function (request, response) {
  response.success(null, this.session.all());
};