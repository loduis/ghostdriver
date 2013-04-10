
goog.provide('phantomjs.atoms.dom');

goog.require('bot.dom');
goog.require('bot.inject');

/**
 * Scrolls the element into the client's view and returns its position
 * relative to the client viewport. If the element or region is too
 * large to fit in the view, it will be aligned to the top-left of the
 * container.
 *
 * The element should be attached to the current document.
 *
 * @param {!Element} elem The element to use.
 * @param {!goog.math.Rect=} opt_elemRegion The region relative to the element
 *     to be scrolled into view.
 * @return {!goog.math.Coordinate} The coordinate of the element in client
 *     space.
 */
phantomjs.atoms.dom.getLocationInView = function(element) {
  return bot.inject.executeScript(bot.dom.getLocationInView, [element], true);
};

phantomjs.atoms.dom.getLocation = function(element) {
  return bot.inject.executeScript(goog.style.getPageOffset, [element], true);
};

phantomjs.atoms.dom.getTagName = function(element) {
  return bot.inject.executeScript(
    'return arguments[0].tagName.toLowerCase()',
    [element],
    true
  );
};

phantomjs.atoms.dom.isSameNode = function (element, other) {
  other = {
    'ELEMENT' : other
  };
  return bot.inject.executeScript(
    'return arguments[0].isSameNode(arguments[1]);',
    [element, other],
    true
  );
};