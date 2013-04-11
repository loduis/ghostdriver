module.exports = function (request, response) {
  response.success(null, {
    build : {
      version   : this.version
    },
    os : {
      name      : this.os.name,
      version   : this.os.version,
      arch      : this.os.architecture
    }
  })
};
