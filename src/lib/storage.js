function Storage(window, name) {
  this._window = window;
  this._name = name;
}

(function (storage){
  storage.setItem = function (key, value) {
    return this._window.waitForStopAndExecuteAtomScript(
      'set_'+ this._name + '_storage_item',
      key,
      value
    );
  };

  storage.removeItem = function(key) {
    return this._window.waitForStopAndExecuteAtomScript(
      'remove_'+ this._name + '_storage_item',
      key
    );
  };

  storage.getItem = function(key) {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_'+ this._name + '_storage_item',
      key
    );
  };

  storage.getKeys = function() {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_'+ this._name + '_storage_keys'
    );
  };

  storage.clear = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'clear_'+ this._name + '_storage'
    );
  };

  storage.getSize = function() {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_'+ this._name + '_storage_size'
    );
  };

})(Storage.prototype);

module.exports = Storage;
