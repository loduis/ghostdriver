function Wait(window) {
  this._window = window;
}

(function (wait) {

  var _timerId = null,
      _slice   = Array.prototype.slice,
      _loading = false;

  function _now() {
    return Date.now();
  }

  function _retryResult(execute, stopTime) {
    var result = { status: 0 },
        value  = execute();
    if (!value.hasOwnProperty('status')) {
      result.value = value;
    } else {
      result = value;
    }
    if ((result.hasOwnProperty('status') &&
        result.status === 0 &&
        result.hasOwnProperty('value') &&
        result.value !== null) || _now() >= stopTime) {
          this.fire('result', result);
        return false;
    }
    return true;
  }

  function _resultLoop(execute, retry, stopTime) {
    if (_retryResult.call(this, execute, stopTime)) {
      _timerId = setTimeout(
        _resultLoop.bind(this, execute, retry, stopTime),
        retry
      );
    }
  }

  function _registerEvent(name, callback) {
    this.on(name, function(){
      this.off(name);
      clearTimeout(_timerId);
      _timerId = null;
      callback.apply(this, _slice.call(arguments));
    });
  }

  function _result(retry, execute, timeout, callback) {
    var stopTime = _now() + timeout;
    _registerEvent.call(this, 'result', callback);
    if (_retryResult.call(this, execute, stopTime)) {
      _timerId = setTimeout(
        _resultLoop.bind(this, execute, retry, stopTime),
        10
      );
    }
  }

  function _loadLoop(retry, stopTime) {
    if (_now() >= stopTime) {
      this.fire('load', 'timeout');
    } else {
      _timerId = setTimeout(_loadLoop.bind(this, retry, stopTime), retry);
    }
  }

  function _load(result, retry, timeout, callback) {
    _registerEvent.call(this, 'load', callback);
    _timerId = setTimeout(
      _loadLoop.bind(this, retry, _now() + timeout),
      10
    );
    if (result !== undefined) {
      setTimeout(function (result) {
        if (!_loading) {
          if (result !== null && result.hasOwnProperty('status')) {
            this.fire('load', 'fail', result);
          } else {
            this.fire('load', 'success', null);
          }
        }
      }.bind(this, result), 0);
    }
  }

  wait.load = function (result) {
    return {
      wait: _load.bind(this._window, result, 100)
    };
  };

  wait.result = function (execute) {
    return {
      wait: _result.bind(this._window, 50, execute)
    };
  };

  wait.notify = function (eventName) {
    _loading = eventName === 'loading';
  };

})(Wait.prototype);


module.exports = Wait;