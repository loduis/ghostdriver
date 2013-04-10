function Wait(window) {
  console.log(typeof window.handle);
  this._window = window;
}

(function (wait) {

  var _timerId = null,
      _slice = Array.prototype.slice;

  function _now() {
    return Date.now();
  }

  function _resultLoop(execute, retry, stopTime) {
    var result = execute();
    if ((result.hasOwnProperty('status') &&
        result.status === 0 &&
        result.hasOwnProperty('value') &&
        result.value !== null) || _now() >= stopTime) {
          this.fire('result', result);
    } else {
      _timerId = setTimeout(
        _resultLoop.bind(this, execute, retry, stopTime),
        retry
      );
    }
  }

  function _registerEvent(name, callback) {
    this.on(name, function(){
      clearTimeout(_timerId);
      _timerId = null;
      callback.apply(this, _slice.call(arguments));
      this.off(name);
    });
  }

  function _result(retry, execute, timeout, callback) {
    _registerEvent.call(this, 'result', callback);
    _timerId = setTimeout(
      _resultLoop.bind(this, execute, retry, _now() + timeout),
      10
    );
  }

  function _loadLoop(retry, stopTime) {
    if (_now() >= stopTime) {
      this.fire('load', 'timeout');
    } else {
      _timerId = setTimeout(_loadLoop.bind(this, retry, stopTime), retry);
    }
  }

  function _load(retry, timeout, callback) {
    _registerEvent.call(this, 'load', callback);
    _timerId = setTimeout(
      _loadLoop.bind(this, retry, _now() + timeout),
      10
    );
  }

  function _off(eventName, params) {
    var args = _slice.call(arguments, 0);
    setTimeout(function () {
      if (!this.loading) {
        this.fire.apply(this, args);
      }
    }.bind(this), 0);
  }

  wait.load = function (retry) {
    retry = retry || 100;
    return {
      wait: _load.bind(this._window, retry),
      off: _off.bind(this._window)
    };
  };

  wait.result = function (retry, execute) {
    return {
      wait: _result.bind(this._window, retry, execute)
    };
  };

  wait.off = function (eventName, params) {
    var args = _slice.call(arguments, 0);
    setTimeout(function () {
      if (!this.loading) {
        this.fire.apply(this, args);
      }
    }.bind(this._window), 0);
  };

})(Wait.prototype);


module.exports = Wait;


/*
module.exports = {
  load: function (retry) {
    return {
      wait: _load.bind(this, retry)
    };
  },
  result: function (retry, execute) {
    return {
      wait: _result.bind(this, retry, execute)
    };
  }
};*/