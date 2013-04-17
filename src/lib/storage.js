function Storage(window, name) {
  this._window = window;
  this._name = name;
}

(function (storage){
  storage.setItem = function (key, value) {
    return this._window.executeAtomScript(
      'set_'+ this._name + '_storage_item',
      key,
      value
    );
  };

  storage.removeItem = function(key) {
    return this._window.executeAtomScript(
      'remove_'+ this._name + '_storage_item',
      key
    );
  };

  storage.getItem = function(key) {
    return this._window.executeAtomScript(
      'get_'+ this._name + '_storage_item',
      key
    );
  };

  storage.__defineGetter__('keys',function () {
    return this._window.executeAtomScript(
      'get_'+ this._name + '_storage_keys'
    );
  });

  storage.clear = function () {
    return this._window.executeAtomScript(
      'clear_'+ this._name + '_storage'
    );
  };

  storage.__defineGetter__('length', function() {
    return this._window.executeAtomScript(
      'get_'+ this._name + '_storage_size'
    );
  });

})(Storage.prototype);

module.exports = Storage;
