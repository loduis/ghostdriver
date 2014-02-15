var platform, exec;

function _success(callback) {
  callback(null);
}

function _getDimmession() {
  return {
    width: screen.width,
    height: screen.height
  };
}

function _xrand(callback, err, stdout, stderr) {
  if (err) {
    callback(stderr);
  } else {
    var regex = /current (\d+) x (\d+)/,
      match  = regex.exec(stdout);
    if (match) {
      this.setSize(parseInt(match[1], 10), parseInt(match[2], 10))
          .then(_success.bind(this, callback));
    } else {
      callback('Error not cant match /current (\d+) x (\d+)/ on: ' + stdout);
    }
  }
}


function maximize(callback) {
  platform = platform || require('system').os.name;
  if (platform === 'linux') {
    exec = exec || require('child_process').execFile;
    exec('xrandr', [], null, _xrand.bind(this, callback));
  } else {
    var screen = this._page.evaluate(_getDimmession);
    this.setSize(screen.width, screen.height)
        .then(_success.bind(this, callback));
  }
}

module.exports = maximize;
