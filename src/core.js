/** @preserve  Prototype JavaScript framework, version 1.7.1
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

(function (prototype){

  var slice = Array.prototype.slice;

  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  if (!prototype.bind) {
    prototype.bind = function (context) {
      if (arguments.length < 2 && arguments[0] === undefined)
        return this;

      if (typeof this !== 'function')
        throw new TypeError("The object is not callable.");

      var nop = function() {};
      var __method = this, args = slice.call(arguments, 1);

      var bound = function() {
        var a = merge(args, arguments);
            c = this instanceof bound ? this : context;
        return __method.apply(c, a);
      };

      nop.prototype   = this.prototype;
      bound.prototype = new nop();

      return bound;
    };
  }

  if (!prototype.curry) {
    prototype.curry = function () {
      if (!arguments.length) return this;
      var __method = this, args = slice.call(arguments, 0);
      return function() {
        var a = merge(args, arguments);
        return __method.apply(this, a);
      };
    };
  }



})(Function.prototype);