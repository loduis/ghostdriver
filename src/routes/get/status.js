/*
function _retry(response) {
  if (!this.lock) {
    try {
      response.success(null, {
        build : {
          version   : this.version
        },
        os : {
          name      : this.os.name,
          version   : this.os.version,
          arch      : this.os.architecture
        }
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  } else {
    console.log('LOCK..');
    setTimeout(_retry.bind(this, response), 0);
  }
}
*/

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
  });
};
