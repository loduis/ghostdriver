function Wait(window) {
  this._window = window;
}

(function (wait, phantom) {

  var _loadTimerId = null,
      _finishTimerId = null,
      _slice   = Array.prototype.slice,
      _loading = false;

  function _now() {
    return Date.now();
  }

  function _loadFinished(retry, status) {
    var url = this._page.url,
        loading = this.loading;
    if (loading) {
      _finishTimerId = setTimeout(_loadFinished.bind(this, retry, status), retry);
    } else {
      clearTimeout(_loadTimerId);
      this.fire('load', status);
    }
  }

  function _loadStarted(retry) {
    this._resources = {};
    this.off('loadStarted');
    this.on('loadFinished', _loadFinished.bind(this, retry));
  }

  function _resourceRequested(req) {
    this._loading = true;
    this._resources[req.id] = {
      url: req.url,
      status: -1
    };
  }

  function _resourceReceived(res) {
    if (res.stage === 'end') {
      console.log(res.id + ': /' + res.status + ' ' + res.url);
      // inline image status is null
      if (res.url.indexOf('data:image/') === 0) {
        res.status = 200;
      }
      if (res.status === null) {
        this._resources[res.id] = {
          url: res.url,
          status: 200
        };
      }
      /*
      if (res.status === null) {
        phantom.exit(1);
      }*/
      // redirect not register stage start
      // simulate start stage
      if (this._resources[res.id] === undefined) {
        /*
          {"contentType":"image/png","headers":[{"name":"Server","value":"Apache/2.2"},{"name":"Content-Type","value":"image/png"},{"name":"Date","value":"Fri, 22 Nov 2013 20:41:18 GMT"},{"name":"Accept-Ranges","value":"bytes"},{"name":"Content-Length","value":"11595"},{"name":"Connection","value":"Keep-Alive"},{"name":"X-Cache-Info","value":"cached"}],"id":168,"redirectURL":null,"stage":"end","status":200,"statusText":"OK","time":"2013-11-22T20:54:35.576Z","url":"http://www.myabakus.org/images/app/sprite.png"}
        */
        console.log(JSON.stringify(res));
        this._resources[res.id] = {
          url: res.url,
          status: -1
        };
      }
      this._resources[res.id]['status'] = res.status;
      this._loading = false;
      var validStatus = [
        200,
        204, // Partial content
        302, // tempory redirect
        301, // Moved Permanently
        304,
        408, // Request timeout
        504 // Gateway timeout
      ];
      // inline images has status null
      if (res.status && validStatus.indexOf(res.status) === -1) {
        console.log('REVIEW STATUS: ' + res.status);
        throw new Error('STATUS PROBLEM: ' + JSON.stringify(res, undefined, 4));
        phantom.exit(1);
      }
    } else if (res.stage === 'start') {
      // start page no has un resource request
      this._resources[res.id] = {
        url: res.url,
        status: -1
      };
    }
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
      setTimeout(
        _resultLoop.bind(this, execute, retry, stopTime),
        retry
      );
    }
  }

  function _result(execute, retry, timeout, callback) {
    if (this.loading) {
      setTimeout(_result.bind(this, execute, retry, timeout, callback), retry);
    } else {
      var stopTime = _now() + timeout;
      this.on(':result', function(){
        this.off('result');
        callback.apply(this, _slice.call(arguments));
      });
      if (_retryResult.call(this, execute, stopTime)) {
        setTimeout(
          _resultLoop.bind(this, execute, retry, stopTime),
          10
        );
      }
    }
  }

  function _loadLoop(retry, stopTime) {
    if (_now() >= stopTime) {
      clearTimeout(_finishTimerId);
      this.fire('load', 'timeout');
    } else {
      _loadTimerId = setTimeout(_loadLoop.bind(this, retry, stopTime), retry);
    }
  }

  function _load(execute, retry, timeout, callback) {
    // espera que la pagina anterior cargue
    if (this.loading) {
      setTimeout(_load.bind(this, execute, retry, timeout, callback), retry);
    } else {
      this.on(':load', function(){
        this.off('load');
        this.off('loadFinished');
        this.off('resourceReceived');
        this.off('resourceRequested');
        callback.apply(this, _slice.call(arguments));
      });
      // una vez cargada registra los eventos.
      this.on('loadStarted', _loadStarted.bind(this, retry));
      this.on('resourceReceived', _resourceReceived);
      this.on('resourceRequested', _resourceRequested);
      execute.call(this);
      _loadTimerId = setTimeout(
        _loadLoop.bind(this, retry, _now() + timeout),
        10
      );
    }
  }

  function _eventLoop(retry, stopTime) {
    if (!this.loading) {
      this.fire('event', 'success');
    } else if (_now() >= stopTime) {
      this.fire('event', 'timeout');
    } else {
      setTimeout(
        _eventLoop.bind(this, retry, stopTime),
        retry
      );
    }
  }

  function _fireEvent(result, retry, timeout) {
    if (result && result.hasOwnProperty('status')) {
      this.fire('event', 'fail', result);
    } else if (this.loading) {
      setTimeout(
        _eventLoop.bind(this, retry, _now() + timeout),
        retry
      );
    } else {
        this.fire('event', 'success');
    }
  }

  function _event(execute, retry, timeout, callback) {
    if (this.loading) {
      setTimeout(_event.bind(this, execute, retry, timeout, callback), retry);
    } else {
      this.on(':event', function() {
        this.off('resourceReceived');
        this.off('resourceRequested');
        this.off('event');
        callback.apply(this, _slice.call(arguments));
      });
      this.on('resourceReceived', _resourceReceived);
      this.on('resourceRequested', _resourceRequested);
      var result = execute.call(this);
      setTimeout(_fireEvent.bind(this, result, retry, timeout), 0);
    }
  }

  function _history(execute, retry, timeout, callback) {
    if (this.loading) {
      setTimeout(_back.bind(this, execute, retry, timeout, callback), retry);
    } else {
      this.on(':load', function(){
        this.off('resourceReceived');
        this.off('resourceRequested');
        this.off('load');
        this.off('loadFinished');
        callback.apply(this, _slice.call(arguments));
      });
      if (execute) {
        this.on('resourceReceived', _resourceReceived);
        this.on('resourceRequested', _resourceRequested);
        this.on('loadFinished', _loadFinished.bind(this, retry));
        execute.call(this);
        _loadTimerId = setTimeout(
          _loadLoop.bind(this, retry, _now() + timeout),
          10
        );
      } else {
        setTimeout(function() {
          this.fire('load', 'success');
        }.bind(this), 0);
      }
    }
  }

  function _stop(execute, done, error) {
    if (this.loading) {
      setTimeout(_stop.bind(this, execute, done), 100);
    } else {
      var result = execute.call(this);
      if (error !== undefined) {
        if (result) {
          done(result);
        } else {
          error(result);
        }
      } else {
        done(result);
      }
    }
  }

  wait.load = function (execute) {
    return {
      wait: _load.bind(this._window, execute, 100)
    };
  };

  wait.event = function(execute) {
    return {
      wait: _event.bind(this._window, execute, 100)
    };
  };

  wait.result = function (execute) {
    return {
      wait: _result.bind(this._window, execute, 50)
    };
  };

  wait.history = function (execute) {
    return {
      wait: _history.bind(this._window, execute, 100)
    };
  };

  wait.stop = function (execute) {
    return {
      then: _stop.bind(this._window, execute)
    };
  };


})(Wait.prototype, phantom);


module.exports = Wait;