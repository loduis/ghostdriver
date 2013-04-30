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

  element.click = function () {
    /*
    var location = this.getLocationInView(),
        x = 0,
        y = 0,
        wait;
    if (location !== null) {
      if (location.hasOwnProperty('status')) {
        wait = this._window.wait.load();
        wait.off('load', 'fail', location);
        return wait;
      } else {
        x += location.x;
        y += location.y;
      }
    }
    var size = this.getSize();

    if (size !== null && size.hasOwnProperty('status')) {
      wait = this._window.wait.load();
      wait.off('load', 'fail', location);
      return wait;
    }
    console.log('LOCATION ' + JSON.stringify(location));
    console.log('SIZE ' + JSON.stringify(size));
    var result = this._window.executeAtomScript(
      'get_client_position',
      this._id
    );
    console.log('PREPARE ' + JSON.stringify(result));
    x += Math.floor(size.width / 2);
    y += Math.floor(size.height / 2);
    this._window.stop();
    this._window.mouse.move(x, y);
    return this._window.mouse.click();
    */
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

  element.sendKeys = function(keys) {
    this._window.stop();
    var result = this.focus();
    this._window.keyboard.sendKeys(keys);
    return this._window.wait.load(result);
  };

  element.on = function(eventName, callback) {
    this._window.on(eventName, callback);
  };

})(Element.prototype);

module.exports = Element;