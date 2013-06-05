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
    return this._window.executeAtomScript(
      'get_tag_name',
      this._id
    );
  };

  element.getText = function () {
    return this._window.executeAtomScript(
      'get_text',
      this._id
    );
  };

  element.getSize = function () {
    return this._window.executeAtomScript(
      'get_size',
      this._id
    );
  };

  element.isSelected = function () {
    return this._window.executeAtomScript(
      'is_selected',
      this._id
    );
  };

  element.isEnabled = function () {
    return this._window.executeAtomScript(
      'is_enabled',
      this._id
    );
  };

  element.isDisplayed = function () {
    return this._window.executeAtomScript(
      'is_displayed',
      this._id
    );
  };

  element.getLocation = function () {
    return this._window.executeAtomScript(
      'get_location',
      this._id
    );
  };

  element.getLocationInView = function () {
    return this._window.executeAtomScript(
      'get_location_in_view',
      this._id
    );
  };

  element.getStyle = function (property) {
    return this._window.executeAtomScript(
      'get_value_of_css_property',
      this._id,
      property
    );
  };

  element.getAttribute = function (name) {
    return this._window.executeAtomScript(
      'get_attribute_value',
      this._id,
      name
    );
  };

  element.clear = function () {
    return this._window.executeAtomScript(
      'clear',
      this._id
    );
  };

  element.submit = function () {
    this._window.stop();
    var result = this._window.executeAtomScript(
      'submit',
      this._id
    );

    return this._window.wait.load(result);
  };

  element.prepareClick = function(coords) {
    return this._window.executeAtomScript(
      'prepare_click',
      this._id,
      coords
    );
  };

  element.click = function () {
    // info position to phantomjs
    // need fixed this
    /*
    this._window.stop();
    var isDisplayed = this.isDisplayed(), wait, x = 0, y = 0;
    if (isDisplayed !== true) {
        wait = this._window.wait.load();
        wait.off('load', 'fail', isDisplayed);
        return wait;
    }
    var positon = this.getLocationInView();
    if (positon !== null) {
      if (positon.hasOwnProperty('status')) {
        wait = this._window.wait.load();
        wait.off('load', 'fail', positon);
        return wait;
      }
      x += positon.x;
      y += positon.y;
    }
    var size = this.getSize();
    if (size !== null) {
      if (size.hasOwnProperty('status')) {
        wait = this._window.wait.load();
        wait.off('load', 'fail', size);
        return wait;
      }
      x += Math.floor(size.width / 2);
      y += Math.floor(size.height / 2);
    }
    var tagName = this.getTagName();
    if (tagName.hasOwnProperty('status')) {
        wait = this._window.wait.load();
        wait.off('load', 'fail', tagName);
        return wait;
    }
    // webkit bug for focus
    if (tagName === 'select' || tagName === 'option') {
      if (tagName === 'option') {
        var result = this._window.executeScript(
          'arguments[0].parentNode.focus();',
          [this._id]
        );
        console.log(JSON.stringify(result));
      } else {
        this.focus();
      }
    }
    this._window.mouse.move(x, y);
    return this._window.mouse.click();
    */
    /*
    var result = this._window.executeAtomScript(
      'click',
      this._id
    );
    return this._window.wait.load(result);*/
    /*
    this._window.stop();
    var coords = this.prepareClick();
    if (coords.hasOwnProperty('status')) {
      var wait = this._window.wait.load();
      wait.off('load', 'fail', coords);
      return wait;
    } else {
      var result = this._window.executeAtomScript(
        'move_mouse',
        this._id
      );
      this._window.mouse.move(coords.x, coords.y);
      return this._window.mouse.click();
    }*/

    var result = this._window.executeAtomScript(
      'click',
      this._id
    );
    return this._window.wait.load(result);
  };

  element.equal = function (other) {
    return this._window.executeAtomScript(
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
    return this._id;
  };

  element.focus = function () {
    return this._window.executeAtomScript(
      'focus_on_element',
      this._id
    );
  };

  element.sendKeys = function(keys, clearModifiers) {
    this._window.stop();
    var result = this.focus();
    this._window.keyboard.sendKeys(keys, clearModifiers);
    return this._window.wait.load(result);
  };

  element.on = function(eventName, callback) {
    this._window.on(eventName, callback);
  };

})(Element.prototype);

module.exports = Element;