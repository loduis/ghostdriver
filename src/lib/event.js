function Event(page) {
  this._page = page;
}

(function (event) {
  var _slice = Array.prototype.slice;

  event.__defineGetter__('key', function () {
    return this._page.event.key;
  });

  event.send = function () {
    this._page.sendEvent.apply(this._page, _slice.call(arguments));
  };

})(Event.prototype);

module.exports = Event;