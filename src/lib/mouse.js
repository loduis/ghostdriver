function Mouse(window) {
  this._window   = window;
}

(function (mouse) {

  // cordinates
  mouse.x = 0;
  mouse.y = 0;

  mouse.move = function(x, y, add) {
    if (add) {
      this.x += x;
      this.y += y;
    } else {
      this.x = x;
      this.y = y;
    }
    this._window.event.send('mousemove', x, y);
  };

  mouse.click = function (button) {
    return this._sendEventAndWait('click', button);
  };

  mouse.doubleClick = function () {
    return this._sendEventAndWait('doubleclick');
  };

  mouse.up = function (button) {
    return this._sendEventAndWait('mouseup', button);
  };

  mouse.down = function (button) {
    this._sendEvent('mousedown', button);
  };

  mouse._sendEventAndWait = function (type, button) {
    var self = this;
    return this._window.wait.event(function () {
      self._sendEvent(type, button);
      return null;
    });
  };

  mouse._sendEvent = function (type, button) {
    this._window.event.send(
      type,
      this.x,
      this.y,
      button === 2 ? 'right' : ( button === 1 ? 'middle' : 'left'),
      this._window.keyboard.modifiers
    );
    // fixed phantom js no fire contextmenu event
    if (button === 2) {
      var script = "var event = document.createEvent('HTMLEvents');" +
                   "event.initEvent('contextmenu', true, false);" +
                   "document.body.dispatchEvent(event);";
      this._window.execute(script);
    }
  };

})(Mouse.prototype);

module.exports = Mouse;