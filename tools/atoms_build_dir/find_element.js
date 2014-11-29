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
 * @fileoverview Ready to inject atoms to find elements in the page.
 */

goog.provide('phantomjs.atoms.inject.locators');

goog.require('bot.locators');
goog.require('phantomjs.atoms.inject');

/**
 * Finds an element by using the given lookup strategy.
 * @param {string} strategy The strategy to use to locate the element.
 * @param {string} using The locator to use.
 * @param {(Document|Element)=} opt_root The document or element to perform
 *     the search under. If not specified, will use {@code document}
 *     as the root.
 * @return {string} The result wrapped
 */
phantomjs.atoms.inject.locators.findElement =
    function(strategy, using, opt_root) {
  var locator = {};
  locator[strategy] = using;
  var result = phantomjs.atoms.inject.executeScript(bot.locators.findElement,
      [locator, opt_root]);
  result = JSON.parse(result);
  if (result.status === 0 && result.value === null) {
      var error = new bot.Error(
        bot.ErrorCode.NO_SUCH_ELEMENT,
        'No Such Element found'
      );
      result = bot.inject.wrapError(error);
  } else if (result.status === bot.ErrorCode.INVALID_ELEMENT_STATE &&
    result.value.message.indexOf('SYNTAX_ERR: DOM Exception 12') !== -1) {
    result.status = bot.ErrorCode.INVALID_SELECTOR_ERROR;
  }
  return JSON.stringify(result);
};


/**
 * Finds all elements by using the given lookup strategy.
 * @param {string} strategy The strategy to use to locate the element.
 * @param {string} using The locator to use.
 * @param {(Document|Element)=} opt_root The document or element to perform
 *     the search under. If not specified, will use {@code document}
 *     as the root.
 * @return {string} The result wrapped
  */
phantomjs.atoms.inject.locators.findElements =
    function(strategy, using, opt_root) {
  var locator = {};
  locator[strategy] = using;
  var result = phantomjs.atoms.inject.executeScript(bot.locators.findElements,
      [locator, opt_root]);
  result = JSON.parse(result);
  if (result.status === bot.ErrorCode.INVALID_ELEMENT_STATE &&
    result.value.message.indexOf('SYNTAX_ERR: DOM Exception 12') !== -1) {
    result.status = bot.ErrorCode.INVALID_SELECTOR_ERROR;
  }
  return JSON.stringify(result);
};