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

  element.clearModifiers = true;

  element.getTagName = function () {
    return this._window.eval('get_tag_name', this._id);
  };

  element.getText = function () {
    return this._window.eval('get_text', this._id);
  };

  element.getSize = function () {
    return this._window.eval('get_size', this._id);
  };

  element.isSelected = function () {
    return this._window.eval('is_selected', this._id);
  };

  element.isEnabled = function () {
    return this._window.eval('is_enabled', this._id);
  };

  element.isDisplayed = function () {
    return this._window.eval('is_displayed', this._id);
  };

  element.getLocation = function () {
    return this._window.eval('get_location', this._id);
  };

  element.getLocationInView = function () {
    return this._window.eval('get_location_in_view', this._id);
  };

  element.getStyle = function (property) {
    return this._window.eval(
      'get_value_of_css_property',
      this._id,
      property
    );
  };

  element.getAttribute = function (name) {
    return this._window.eval('get_attribute_value', this._id, name);
  }

  element.clear = function () {
    return this._window.eval('clear', this._id);
  };

  element.submit = function () {
    var wait = this._window.wait.load();
    try {
      var result = this._window.eval('submit', this._id);
      wait.off('load', 'success');
    } catch (e) {
      wait.off('load', 'fail', e.result);
    }
    return wait;
  };

  element.find = function (locator) {
    return this._window.find(locator, this._id);
  };

  element.findAll = function (locator) {
    return this._window.findAll(locator, this._id);
  };

  element.on = function (eventName, callback) {
    this._window.on(eventName, callback);
  };

  element.off = function (eventName) {
    this._window.on(eventName);
  };

  element.click = function () {
    var wait = this._window.wait.load();
    try {
      var result = this._window.eval('click', this._id);
      wait.off('load', 'success');
    } catch (e) {
      wait.off('load', 'fail', e.result);
    }
    return wait;
  };

  element.getId = function () {
    return this._id;
  };

  element.setValue = function(value) {
    var result = this.clear();
    this._window.keyboard.sendKeys(value);
    if (this.clearModifiers) {
      this._window.keyboard.clearModifiers();
    }
    return result;
  };

  element.equal = function (other) {
    return this._window.eval('is_same_node', this._id, other);
  }

})(Element.prototype);

module.exports = Element;