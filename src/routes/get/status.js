module.exports = function (request, response) {
  response.success(null, {
    build : {
      version   : ghostdriver.version
    },
    os : {
      name      : ghostdriver.os.name,
      version   : ghostdriver.os.version,
      arch      : ghostdriver.os.architecture
    }
  })
};
