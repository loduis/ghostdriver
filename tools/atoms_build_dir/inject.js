
goog.provide('phantomjs.atoms.inject');

goog.require('bot.inject');


/**
 * Executes an injected script, which is expected to finish asynchronously
 * before the given {@code timeout}. When the script finishes or an error
 * occurs, the given {@code onDone} callback will be invoked. This callback
 * will have a single argument, a {@link bot.response.ResponseObject} object.
 *
 * The script signals its completion by invoking a supplied callback given
 * as its last argument. The callback may be invoked with a single value.
 *
 * The script timeout event will be scheduled with the provided window,
 * ensuring the timeout is synchronized with that window's event queue.
 * Furthermore, asynchronous scripts do not work across new page loads; if an
 * "unload" event is fired on the window while an asynchronous script is
 * pending, the script will be aborted and an error will be returned.
 *
 * Like {@code bot.inject.executeScript}, this function should only be called
 * from an external source. It handles wrapping and unwrapping of input/output
 * values.
 *
 * @param {(function()|string)} fn Either the function to execute, or a string
 *     defining the body of an anonymous function that should be executed.
 * @param {Array.<*>} args An array of wrapped script arguments, as defined by
 *     the WebDriver wire protocol.
 * @param {number} timeout The amount of time, in milliseconds, the script
 *     should be permitted to run; must be non-negative.
 * @param {function(string)|function(!bot.response.ResponseObject)} onDone
 *     The function to call when the given {@code fn} invokes its callback,
 *     or when an exception or timeout occurs. This will always be called.
 * @param {boolean=} opt_stringify Whether the result should be returned as a
 *     serialized JSON string.
 * @param {!Window=} opt_window The window to synchronize the script with;
 *     defaults to the current window.
 */

phantomjs.atoms.inject.executeAsyncScript = function(fn, args, timeout) {
    bot.inject.executeAsyncScript(fn, args, timeout, callPhantom);
};