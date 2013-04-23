var
  _allCommands = require('./command'),
  _parts,
  _length,
  _params,
  _commands = {
    'post': {},
    'get': {},
    'put': {},
    'delete': {}
  };

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function _getNumArguments(functionName) {
  var names = functionName.toString().
      match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].split(',');
  return names.length;
}

function _getSessionId() {
  return _length >= 2 && _parts[0] === 'session' ? _parts[1] : null;
}

function _getChunk(index) {
  return _parts[index - 1];
}

function _getElementId() {
  if (typeof _parts[3] !== 'undefined' && _parts[2] === 'element' &&
                        _parts[3] !== 'active') {
    return _parts[3];
  }
}

function _getWindowHandle() {
  return _parts[2] === 'window' && _length > 3 ? _parts[3] : 'current';
}

function _getParams() {
  var method = this.method;
  if (method === 'POST' || method === 'DELETE') {
    try {
      if (_params === null) {
        var post = this.hasOwnProperty('postRaw') ?
                      this.postRaw :
                      this.post;
        _params = JSON.parse(post);
      }
    } catch (e) {
      _params = {};
    }
  }
  return _params;
}

function _getParam(name) {
  var params = this.getParams();
  return params[name];
}

function _getCommandFromUrl() {
  var command,
      //un new copy of the array
      split = _parts.slice();
  if (_length === 1) {
      command = split[0];
  } else if (_length > 1) {
    split[1] = 'id';
    if (_length > 3) {
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
    if (_length > 4) {
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

  return command;
}

function _getCallbackFromFileOrCache(method, command) {
  if (command !== undefined) {
    var callback = _commands[method][command];
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
  }
  return null;
}

function _getCallback(command) {
  var method = this.method.toLowerCase();
  command = _getCommandFromUrl(command);

  // ONLY FOR DEBUG REMOVE AFTER
  var execute = method + ' /' + command, i;
  console.log(execute);
  if ((i = _allCommands.indexOf(execute)) !== -1) {
    _allCommands.remove(i);
  }
  if (method === 'DELETE' && command === 'session/id') {
    console.log('--------------------------PENDING-----------------------');
    _allCommands.forEach(function (name, i) {
      console.log(i + '. ' + name);
    });
  }

  return _getCallbackFromFileOrCache(method, command);

}

function extend(request) {
  var url = request.url;
  // fixed hub
  if (url.indexOf('/wd/hub') === 0) {
    url = url.replace('/wd/hub', '');
  }

  request.url = url;

  _parts  = url.substr(1).split('/');
  _length = _parts.length;
  _params = null;

  request.getCallback     = _getCallback;
  request.getParam        = _getParam;
  request.getParams       = _getParams;
  request.getWindowHandle = _getWindowHandle;
  request.getSessionId    = _getSessionId;
  request.getChunk        = _getChunk;
  request.getElementId    = _getElementId;

  return request;
}

module.exports = {
  extend: extend
};
