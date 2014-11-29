function Alert(window) {
  var self = this;

  self.text = '';

  this._window = window;

  window.on('alert', function (text) {
    this.fire('dialog', text);
  });

  window.on('confirm', function (text) {
    this.fire('dialog', text);
  });

  window.on('dialog', function (text) {
    self.text = text;
  });
}

(function (alert) {

  alert.ok = function () {
  };

  alert.cancel = function () {
  };


})(Alert.prototype);

module.exports = Alert;