var WebServerRequest = function () {

  var _allCommands = require('./command');

  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  var _commands = {
        'post': {},
        'get': {},
        'put': {},
        'delete': {}
      };

  function _getNumArguments(functionName) {
    var names = functionName.toString().
        match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].split(',');
    return names.length;
  }

  function extend(request) {
    var url = request.url;
    // fixed hub
    if (url.indexOf('/wd/hub') === 0) {
      url = url.replace('/wd/hub', '');
    }
    request.url = url;
    var parts  = url.substr(1).split('/'),
        length = parts.length,
        params = null;

    request.getSessionId = function () {
      return length >= 2 && parts[0] === 'session' ? parts[1] : null;
    };

    request.getChunk = function (index) {
      return parts[index - 1];
    };

    request.getElementId = function () {
      if (typeof parts[3] !== 'undefined' && parts[2] === 'element' &&
                            parts[3] !== 'active') {
        return parts[3];
      }
    };

    request.getWindowHandle = function () {
      return parts[2] === 'window' && length > 3 ? parts[3] : 'current';
    };


    request.getParams = function () {
      var method = this.method;
      if (method === 'POST' || method === 'DELETE') {
        try {
          if (params === null) {
            var post = this.hasOwnProperty('postRaw') ?
                          this.postRaw :
                          this.post;
            params = JSON.parse(post);
          }
        } catch (e) {
          params = {};
        }
      }
      return params;
    };



    request.getParam  = function (name) {
      var params = this.getParams();
      return params[name];
    };

    request.getCallback = function (command) {
      if (command === undefined) {
        var split = parts.slice();
        if (length === 1) {
            command = split[0];
        } else if (length > 1) {
          split[1] = 'id';
          if (length > 3) {
            if (split[2] === 'element') {
              if (split[3] !== 'active') {
                split[3] = 'id';
              }
            } else if (split[2] === 'cookie') {
              split[3] = 'name';
            } else if (split[2] === 'window') {
              split[3] = 'handle';
            } else if (split[3] === 'key') { // local store and session store
              split[4] = 'name';
            }
          }
          if (length > 4) {
            if (split[4] === 'attribute') {
              split[5] = 'name';
            } else if (split[4] === 'css') {
              split[5] = 'property';
            } else if (split[4] === 'equals') {
              split[5] = 'other';
            }
          }
          command = split.join('/');
        }
      }
      var execute = request.method + ' /' + command, i;
      console.log(execute);
      if ((i = _allCommands.indexOf(execute)) !== -1) {
        _allCommands.remove(i);
      }
      if (request.method === 'DELETE' && command === 'session/id') {
        console.log('--------------------------PENDING-----------------------');
        _allCommands.forEach(function (name, i) {
          console.log(i + '. ' + name);
        });
      }

      if (command !== undefined) {
        var method = this.method.toLowerCase(),
            callback = _commands[method][command];
        if (callback === undefined) {
          try {
            callback = require(
              '../routes/' + method + '/' + command
            );
            callback.numArguments = _getNumArguments(callback);
            _commands[method][command] = callback;
          } catch(e) {
            return null;
          }
        }
        return callback;
      } else {
        return null;
      }
    };
    return request;
  }

  return {
    extend: extend
  };

}();

module.exports = WebServerRequest;