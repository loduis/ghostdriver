function Mouse(page, keyboard, wait) {
  this._page = page;
  this._wait = wait;
  this._keyboard = keyboard;
}

(function (mouse) {

  // cordinates
  mouse.x = 0;
  mouse.y = 0;

  mouse.move = function(x, y) {
    this.x = x;
    this.y = y;
    this._page.sendEvent('mousemove', x, y);
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
    var wait = this._wait.load();
    this._sendEvent(type, button);
    wait.off('load', 'success');
    return wait;
  };

  mouse._sendEvent = function (type, button) {
    this._page.sendEvent(
      type,
      this.x,
      this.y,
      button === 2 ? 'right' : ( button === 1 ? 'middle' : 'left'),
      this._keyboard.modifiers
    );
    // fixed phantom js no fire contextmenu event
    if (button === 2) {
      this._page.evaluate(function () {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('contextmenu', true, false);
        document.body.dispatchEvent(event);
      });
    }
  };

})(Mouse.prototype);

module.exports = Mouse;