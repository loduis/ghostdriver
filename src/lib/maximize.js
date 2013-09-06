var platform, spawn;




function maximize(callback) {
  spawn = spawn || require('child_process').spawn;
  platform = platform || require('system').os.name;
  var self = this;
  if (platform === 'linux') {
    var xrandr    = spawn('xrandr', []);
    // success
    xrandr.stdout.on('data', function (data) {
      var regex = /current (\d+) x (\d+)/,
          match  = regex.exec(data);
      if (match) {
        self.setSize(parseInt(match[1], 10), parseInt(match[2], 10)).then(function() {
          callback(null);
        });
      } else {
        callback('Error not cant match /current (\d+) x (\d+)/ on: ' + data);
      }
      xrandr.kill('SIGHUP');
    });
    // on error
    xrandr.stderr.on('data', function (data) {
      callback(data);
      xrandr.kill('SIGHUP');
    });

  } else {
    var screen = this._page.evaluate(function () {
      return {
        width: screen.width,
        height: screen.height
      };
    });
    this.setSize(screen.width, screen.height).then(function() {
      callback(null);
    });
  }
}

module.exports = maximize;
