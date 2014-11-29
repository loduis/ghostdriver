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
 * @fileoverview Ready to inject atoms for handling frames.
 */

goog.provide('phantomjs.atoms.inject.frame');

goog.require('bot.frame');
goog.require('bot.inject.cache');
goog.require('phantomjs.atoms.inject');



/**
 * Gets the index of a frame in the given window. Note that the element must
 * be a frame or an iframe.
 *
 * @param {!(HTMLIFrameElement|HTMLFrameElement)} element The iframe or frame
 *     element.
 * @return {string} The result wrapped
 */
phantomjs.atoms.inject.frame.getFrameIndex = function(element) {
  return phantomjs.atoms.inject.executeScript(bot.frame.getFrameIndex, [element]);
};


