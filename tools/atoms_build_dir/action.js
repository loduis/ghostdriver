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
  return /** @type {string} */ phantomjs.atoms.inject.executeScript(bot.action.submit, [element]);
};


/**
 * Clear an element.
 *
 * @param {!{bot.inject.ELEMENT_KEY:string}} element The element to clear.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 * @see bot.action.clear
 */
phantomjs.atoms.inject.action.clear = function(element) {
  return /** @type {string} */ phantomjs.atoms.inject.executeScript(bot.action.clear, [element]);
};

/**
 * Sends key events to simulating typing on an element.
 *
 * @param {!{bot.inject.ELEMENT_KEY:string}} element The element to submit.
 * @param {!Array.<string>} keys The keys to type.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 */
phantomjs.atoms.inject.action.type = function(element, keys) {
  return phantomjs.atoms.inject.executeScript(webdriver.atoms.element.type,
      [element, keys]);
};

/**
 * Click an element.
 *
 * @param {!{bot.inject.ELEMENT_KEY:string}} element The element to click.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 * @see bot.action.click
 */
phantomjs.atoms.inject.action.click = function(element) {
  return /** @type {string} */ phantomjs.atoms.inject.executeScript(bot.action.click, [element]);
};