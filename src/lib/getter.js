var _defineGetter = function() {
  var _modules = {};

  function _defineGetter(object, name, module, callback) {
    var _this;

    if (arguments.length === 3) {
      callback = module;
      module = name;
    }

    module = module.toLowerCase();

    function _getter() {
      return _this;
    }

    function _require() {
      if (!_modules.hasOwnProperty(module)) {
        _modules[module] = require('./' + module);
      }
      var _Class = _modules[module];
      _this = callback.call(this, _Class);
      object.__defineGetter__(name, _getter);
      return _this;
    }

    object.__defineGetter__(name, _require);
  }

  return _defineGetter;

}();

module.exports = _defineGetter;