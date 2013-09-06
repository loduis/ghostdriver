function Element(window, element) {
  if (typeof element === 'string') {
    element = {
      'ELEMENT' : element
    };
  }
  this._id = element;
  this._window = window;
}

(function (element) {

  element.getTagName = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_tag_name',
      this._id
    );
  };

  element.getText = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_text',
      this._id
    );
  };

  element.getSize = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_size',
      this._id
    );
  };

  element.isSelected = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'is_selected',
      this._id
    );
  };

  element.isEnabled = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'is_enabled',
      this._id
    );
  };

  element.isDisplayed = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'is_displayed',
      this._id
    );
  };

  element.getLocation = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_location',
      this._id
    );
  };

  element.getLocationInView = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_location_in_view',
      this._id
    );
  };

  element.getCssValue = function (property) {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_value_of_css_property',
      this._id,
      property
    );
  };

  element.getAttribute = function (name) {
    return this._window.waitForStopAndExecuteAtomScript(
      'get_attribute_value',
      this._id,
      name
    );
  };

  element.clear = function () {
    return this._window.waitForStopAndExecuteAtomScript(
      'clear',
      this._id
    );
  };

  element.submit = function () {
    var self = this;
    return this._window.wait.event(function() {
      return this.executeAtomScript(
        'submit',
        self._id
      );
    });
  };
  /*
  element.prepareClick = function(coords) {
    return this._window.executeAtomScript(
      'prepare_click',
      this._id,
      coords
    );
  };
  */
  element.click = function () {
    var self = this;
    return this._window.wait.event(function() {
      return this.executeAtomScript(
        'click',
        self._id
      );
    });
  };

  element.equal = function (other) {
    return this._window.waitForStopAndExecuteAtomScript(
      'is_same_node',
      this._id,
      other
    );
  };


  element.find = function (locator) {
    return this._window.find(locator, this._id);
  };

  element.findAll = function (locator) {
    return this._window.findAll(locator, this._id);
  };

  element.getId = function () {
    var self = this;
    return this._window.wait.stop(function() {
      return self._id;
    });
  };

  element.focus = function () {
    return this._window.executeAtomScript(
      'focus_on_element',
      this._id
    );
  };

  element.sendKeys = function(keys, clearModifiers) {
    var self = this;
    return this._window.wait.event(function () {
      var result = self.focus();
      this.keyboard.sendKeys(keys, clearModifiers);
      return result;
    });
  };

  element.filePicker = function(value, timeout, callback) {
    var self = this._window;
    this._window.on('filePicker', function(){
      return value;
    });

    this.click().wait(timeout, function(status, result){
      self.off('filePicker');
      callback(status, result);
    });
  };

})(Element.prototype);

module.exports = Element;