// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms for querying the DOM.
 */

goog.provide('phantomjs.atoms.inject.dom');

goog.require('bot.action');
goog.require('bot.dom');
goog.require('webdriver.atoms.element');
goog.require('phantomjs.atoms.inject');


/**
 * Gets the visisble text for the given element.
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @return {string} The visible text wrapped in a JSON string as defined by the
 *     WebDriver wire protocol.
 */
phantomjs.atoms.inject.dom.getText = function(element) {
  return phantomjs.atoms.inject.executeScript(bot.dom.getVisibleText,
      [element]);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @return {string} A boolean describing whether the element is
 *     checked or selected wrapped in a JSON string as defined by
 *     the wire protocol.
 */
phantomjs.atoms.inject.dom.isSelected = function(element) {
  return phantomjs.atoms.inject.executeScript(bot.dom.isSelected, [element]);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {string} attribute The attribute to look up.
 * @return {string} The requested attribute value in a JSON string
 *     as defined by the wire protocol.
 */
phantomjs.atoms.inject.dom.getAttributeValue = function(element, attribute) {
  var result = phantomjs.atoms.inject.executeScript(
        webdriver.atoms.element.getAttribute,
        [element, attribute]
      ),
      object = JSON.parse(result);
  if (object.status === 0 && object.value === '0' && attribute === 'value') {
    result = phantomjs.atoms.inject.executeScript(
      getAttribute,
      [element, attribute]
    );
  }

  return result;

  function getAttribute(element, attribute) {
    var value = bot.dom.getAttribute(element, attribute);
    return goog.isDefAndNotNull(value) ? value.toString() : null;
  }
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @return {string} The element size in a JSON string as
 *     defined by the wire protocol.
 */
phantomjs.atoms.inject.dom.getSize = function(element) {
  return phantomjs.atoms.inject.executeScript(getSize, [element]);

  function getSize(e) {
    var rect = bot.dom.getClientRect(e);
    return {'width': rect.width, 'height': rect.height};
  }
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {string} property The property to look up.
 * @return {string} The value of the requested CSS property in a JSON
 *     string as defined by the wire protocol.
 */
phantomjs.atoms.inject.dom.getValueOfCssProperty =
    function(element, property) {
  return phantomjs.atoms.inject.executeScript(bot.dom.getEffectiveStyle,
      [element, property]);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @return {string} A boolean describing whether the element is enabled
 *     in a JSON string as defined by the wire protocol.
 */
phantomjs.atoms.inject.dom.isEnabled = function(element) {
  return phantomjs.atoms.inject.executeScript(bot.dom.isEnabled, [element]);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to check.
 * @return {string} true if the element is visisble, false otherwise.
 *     The result is wrapped in a JSON string as defined by the wire
 *     protocol.
 */
phantomjs.atoms.inject.dom.isDisplayed = function(element) {
  return phantomjs.atoms.inject.executeScript(bot.dom.isShown,
      [element, /*ignoreOpacity=*/true]);
};

/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @return {string} The coordinates of the top left corner in a JSON
 *     string as defined by the wire protocol.
 */
phantomjs.atoms.inject.dom.getLocationInView = function(element) {
  return phantomjs.atoms.inject.executeScript(
      webdriver.atoms.element.getLocationInView,
      [element]
  );
};

phantomjs.atoms.inject.dom.getLocation = function(element) {
  return phantomjs.atoms.inject.executeScript(
    goog.style.getPageOffset, [element]
  );
};

phantomjs.atoms.inject.dom.getTagName = function(element) {
  return phantomjs.atoms.inject.executeScript(
    'return arguments[0].tagName.toLowerCase()',
    [element]
  );
};

phantomjs.atoms.inject.dom.isSameNode = function (element, other) {
  other = {
    'ELEMENT' : other
  };
  return phantomjs.atoms.inject.executeScript(
    'return arguments[0].isSameNode(arguments[1]);',
    [element, other]
  );
};