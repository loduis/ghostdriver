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
 * @fileoverview Ready to inject atoms for manipulating the DOM.
 */

goog.provide('phantomjs.atoms.inject.action');

goog.require('bot.action');
goog.require('bot.events');
goog.require('goog.dom.selection');
goog.require('webdriver.atoms.element');
goog.require('phantomjs.atoms.inject');

/**
 * Submits the form containing the given element.
 *
 * @param {!{bot.inject.ELEMENT_KEY:string}} element The element to submit.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 */
phantomjs.atoms.inject.action.submit = function(element) {
  return phantomjs.atoms.inject.executeScript(bot.action.submit, [element]);
};

/**
 * Clear an element.
 *
 * @param {!{bot.inject.ELEMENT_KEY:string}} element The element to clear.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 * @see bot.action.clear
 */
phantomjs.atoms.inject.action.clear = function(element) {
  return phantomjs.atoms.inject.executeScript(bot.action.clear, [element]);
};

/**
 * Focuses on the given element if it is not already the active element.
 *
 * @param {!Element} element The element to focus on.
 */
phantomjs.atoms.inject.action.focusOnElement = function(element) {
  return phantomjs.atoms.inject.executeScript(
    bot.action.focusOnElement, [element]
  );
};

/**
 * Click an element.
 *
 * @param {!{bot.inject.ELEMENT_KEY:string}} element The element to click.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 * @see bot.action.click
 */
phantomjs.atoms.inject.action.click = function(element) {
  return phantomjs.atoms.inject.executeScript(bot.action.click, [element]);
};

/**
 * Clicks on the given {@code element} with a virtual mouse.
 *
 * @param {!Element} element The element to click.
 * @param {goog.math.Coordinate=} opt_coords Mouse position relative to the
 *   element.
 * @throws {bot.Error} If the element cannot be interacted with.
 */
phantomjs.atoms.inject.action.prepareClick = function (element, opt_coords) {

  function prepare_(element, opt_coords) {
    if (!bot.dom.isShown(element, /*ignoreOpacity=*/true)) {
      throw new bot.Error(bot.ErrorCode.ELEMENT_NOT_VISIBLE,
          'Element is not currently visible and may not be manipulated');
    }
    // Unlike element.scrollIntoView(), this scrolls the minimal amount
    // necessary, not scrolling at all if the element is already in view.
    var doc = goog.dom.getOwnerDocument(element),
        coords = {};
    goog.style.scrollIntoContainerView(element, doc.body);

    // NOTE(user): Ideally, we would check that any provided coordinates fall
    // within the bounds of the element, but this has proven difficult, because:
    // (1) Browsers sometimes lie about the true size of elements, e.g. when text
    // overflows the bounding box of an element, browsers report the size of the
    // box even though the true area that can be interacted with is larger; and
    // (2) Elements with children styled as position:absolute will often not have
    // a bounding box that surrounds all of their children, but it is useful for
    // the user to be able to interact with this parent element as if it does.
    if (opt_coords) {
      coords = goog.math.Vec2.fromCoordinate(opt_coords);
    } else {
      var size = bot.action.getInteractableSize(element);
      coords = new goog.math.Vec2(size.width / 2, size.height / 2);
    }
    var position = goog.style.getClientPosition(element);
    coords.x += position.x;
    coords.y += position.y;
    // bug in webkit for select elements.
    if (bot.dom.isElement(element, goog.dom.TagName.OPTION) ||
       bot.dom.isElement(element, goog.dom.TagName.SELECT)) {
      // On some browsers, a mouse down event on an OPTION or SELECT element cause
      // the SELECT to open, blocking further JS execution. This is undesirable,
      // and so needs to be detected. We always focus in this case.
      // TODO(simon): This is a nasty way to avoid locking the browser

      bot.action.focusOnElement(element);

      // When an element is toggled as the result of a click, the toggling and the
      // change event happens before the click event. However, on radio buttons and
      // checkboxes, the click handler can prevent the toggle from happening, so
      // for those we need to fire a click before toggling to see if the click was
      // cancelled. For option elements, we toggle unconditionally before the click.
      if (bot.dom.isSelectable(element) && !bot.dom.isSelected(element)) {
        var select = /** @type {!Element} */ (goog.dom.getAncestor(element,
            function(node) {
              return bot.dom.isElement(node, goog.dom.TagName.SELECT);
            }
        ));
        if (!select.multiple) {
          bot.events.fire(select, bot.events.EventType.CHANGE);
        }
      }
    }
    return coords;
  }

  return phantomjs.atoms.inject.executeScript(
    prepare_,
    [element, opt_coords]
  );
};
