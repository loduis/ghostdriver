var WebServerRequest = function () {

  var _commands = {
        'post': {},
        'get': {},
        'put': {},
        'delete': {}
      };

  function _getParam(name) {
    var params = this.getParams();
    return params[name];
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

    request.getElement = function () {
        return {
            'ELEMENT' : parts[3]
        };
    };


    request.getParams = function getParams() {
      var method = this.method;
      if (method === 'POST') {
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

    request.getParam  = _getParam;

    request.getCallback = function () {
      var split = parts.slice(),
          command = null;
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
          } else if (split[3] === 'key') { // local store and session store
            split[4] = 'name';
          }
        }
        if (length > 4) {
          if (split[4] === 'attribute') {
            split[5] = 'name';
          } else if (split[4] === 'css') {
            split[5] = 'property';
          }
        }
        command = split.join('/');
      }
      console.log(request.method + ' ' + request.url);
      console.log('COMMAND: ' + command);

      if (command !== null) {
        var method = this.method.toLowerCase(),
            callback = _commands[method][command];
        if (callback === undefined) {
          try {
            callback = require(
              './routes/' + method + '/' + command
            );
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