function Element(window, element) {
  if (typeof element === 'string') {
    this._id = {
      'ELEMENT' : element
    };
  } else {
    this._id = element;
  }
  this._window = window;
}

(function (element) {

  function returnValueOrThrowError(result) {
    if (result.hasOwnProperty('status')) {
      if (result.status === 0) {
        return result.value;
      }
    }
    var error = new Error();
    error.result = result;
    throw error;
  }

  element.clearModifiers = true;

  element.getTagName = function () {
    var result = this._window.eval('get_tag_name', this._id);
    return returnValueOrThrowError(result);
  };

  element.getText = function () {
    var result = this._window.eval('get_text', this._id);
    return returnValueOrThrowError(result);
  };

  element.getSize = function () {
    var result = this._window.eval('get_size', this._id);
    return returnValueOrThrowError(result);
  };

  element.isSelected = function () {
    var result = this._window.eval('is_selected', this._id);
    return returnValueOrThrowError(result);
  };

  element.isEnabled = function () {
    var result = this._window.eval('is_enabled', this._id);
    return returnValueOrThrowError(result);
  };

  element.isDisplayed = function () {
    var result = this._window.eval('is_displayed', this._id);
    return returnValueOrThrowError(result);
  };

  element.getLocation = function () {
    var result = this._window.eval('get_location', this._id);
    return returnValueOrThrowError(result);
  };

  element.getLocationInView = function () {
    var result = this._window.eval('get_location_in_view', this._id);
    return returnValueOrThrowError(result);
  };

  element.getStyle = function (property) {
    var result = this._window.eval(
      'get_value_of_css_property',
      this._id,
      property
    );
    return returnValueOrThrowError(result);
  };

  element.getAttribute = function (name) {
    var result = this._window.eval('get_attribute_value', this._id, name);
    return returnValueOrThrowError(result);
  }

  element.clear = function () {
    var result = this._window.eval('clear', this._id);
    return returnValueOrThrowError(result);
  };

  element.submit = function () {
    var result = this._window.eval('submit', this._id),
        wait = this._window.wait.load();
    if (result.status !== 0) {
      wait.off('load', 'fail', result);
    }
    return wait;
  };

  /*
  element.isInValidLocator = function(locator) {
    return this._window.isInValidLocator(locator);
  };*/

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
    var result = this._window.eval('click', this._id),
        wait = this._window.wait.load();
    if (result.status !== 0) {
      wait.off('load', 'fail', result);
    } else {
      wait.off('load', 'success');
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

  /*
  element.mouseMove = function (coords) {
    var result = this._window.mouseMove(this._id, coords);
    return returnValueOrThrowError(result);
  };*/

})(Element.prototype);

module.exports = Element;