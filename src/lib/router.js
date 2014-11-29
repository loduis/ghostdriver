var
  router = {},
  _routes = {
    'POST': {},
    'GET': {},
    'DELETE': {}
  },
  _Response = require('./response');

function _getCommand(request) {
  var command,
      //un new copy of the array
      split = request.url.substr(1).split('/'),
      length = split.length,
      params = {};
  if (length === 1) {
      command = split[0];
  } else if (length > 1) {
    params.sessionId = split[1];
    split[1] = ':sessionId';
    if (length > 3) {
      params.windowHandle = 'current';
      if (split[2] === 'element') {
        if (split[3] !== 'active') {
          params.id = split[3];
          split[3] = ':id';
        }
      } else if (split[2] === 'cookie') {
        params.name = split[3];
        split[3] = ':name';
      } else if (split[2] === 'window') {
        params.windowHandle =split[3];
        split[3] = ':windowHandle';
      } else if (split[3] === 'key') { // local store and session store
        params.key = split[4];
        split[4] = ':key';
      }
    }
    if (length > 4) {
      if (split[4] === 'attribute') {
        params.name = split[5];
        split[5] = ':name';
      } else if (split[4] === 'css') {
        params.propertyName = split[5];
        split[5] = ':propertyName';
      } else if (split[4] === 'equals') {
        params.other = split[5];
        split[5] = ':other';
      }
    }
    command = split.join('/');
  }

  request.params = params;

  return '/' + command;
}

function _getNumArguments(functionName) {
  var names = functionName.toString().
      match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].split(',');
  return names.length;
}

function _verb(method, path, callback) {
  _routes[method][path] = callback;
}

router.parse = function(request) {
  var url = request.url,
      method = request.method ;
  if (method === 'POST' || method === 'DELETE') {
    try {
        var post = request.hasOwnProperty('postRaw') ?
                    request.postRaw :
                    request.post;
        request.body = JSON.parse(post);
    } catch (e) {
      request.body = {};
    }
  }

  var command = _getCommand(request);

  // console.log(method + ' ' + command);

  var callback = _routes[method][command];

  if (callback && !callback.hasOwnProperty('numArguments')) {
    callback.numArguments = _getNumArguments(callback);
  }

  return callback;
};


router.dispatch = function (request, response) {
  // extends the response object method
  _Response.extend(response);
  // format url al request for callback
  //console.log(request.url);
  var
    callback = router.parse(request),
    args = [];
  if (callback === undefined) {
    return response.error.invalidCommandMethod(request);
  } else if (callback.numArguments > 2) {
    // params in the rest url
    var params  = request.params,
        session   = ghostdriver.session.get(params.sessionId);
    if (params.sessionId === null) {
      return response.error.variableResourceNotFound(request);
    }
    args.unshift(session);
    if (callback.numArguments === 4) {
      var window = session.getWindow(params.windowHandle);
      if (window === null) {
        return response.error.noSuchWindow(
          'the currently selected window has been closed',
          session,
          request
        );
      }
      var element = window;
      if (params.id !== undefined) {
        element = new window.Element(params.id);
      }
      // parametro elemento
      args.unshift(element);
    }
  }
  args.push(request, response);
  try {
    callback.apply(ghostdriver, args);
  } catch (e) {
    ghostdriver.log(JSON.stringify(e));
  }
};

// add rest method to router
for (var method in _routes) {
  router[method.toLowerCase()] = _verb.bind(router, method);
}

module.exports = require('./routes').create(router);
