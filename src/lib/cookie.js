function Cookie(page) {
  this._page = page;
}

(function (cookie) {

  cookie.add = function (cookie) {
    return this._page.addCookie(cookie);
  };

  cookie.clear = function () {
    return this._page.clearCookies();
  };

  cookie.remove = function(name) {
    return this._page.deleteCookie(name);
  };

  cookie.__defineGetter__('all', function () {
    return this._page.cookies;
  });

})(Cookie.prototype);

module.exports = Cookie;