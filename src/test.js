var
  ghostdriver     = require('./lib/ghostdriver'),
  session         = require('./lib/session').create(),
  win             = session.getWindow(),
  pageTimeout     = session.getPageLoadTimeout(),
  implicitTimeout = session.getImplicitTimeout();

var assert = {
  equal: function (a, b, message) {
    message = message || message;
    console.log((a === b ? 'Success' : 'Failure') + ': ' + message);
  },
  count: function (expect, got, message) {
    this.equal(expect, got.length, message);
  }
};

win.open('http://localhost:4567/').wait(pageTimeout, function (status) {
  assert.equal('success', status, 'Page load ' + this.url);
  if (status === 'success') {
    var currentHandle = session.getCurrentWindowHandle();
    assert.count(32, currentHandle, 'Current handle length');
    this.find('#popup').wait(implicitTimeout, function (result) {
      var element = new this.Element(result.value);
      element.click().wait(pageTimeout, function (status) {
        var handles = session.getWindowHandles();
        assert.count(2, handles, 'Number of the window in the session');
        handles.forEach(function (handle) {
          if (handle !== currentHandle) {
            win2 = session.switchToWindow(handle);
            assert.equal(
              session.getCurrentWindowHandle(),
              handle,
              'Change de current window handle'
            );
            win2.find('#child_popup').wait(implicitTimeout, function(result) {
              assert.equal(this, win2, 'object');
              assert.equal(win2.handle, this.handle, 'Equal window object');
              var child = new this.Element(result.value);
              assert.equal('div', child.getTagName(), 'Tag name');
              assert.equal('I am popup', child.getText(), 'InnerText');
              assert.equal(true, session.closeWindow(), 'Close the current window');
              win2 = session.switchToWindow(handle);
              assert.equal(null, win2, 'The window it should null');
              win = session.switchToWindow(currentHandle);
              assert.equal(win.handle, currentHandle, 'Equal window object');
              assert.count(1, session.getWindowHandles(), 'Number of window open.');
              win.executeAsyncScript(
                'arguments[0](document.title)',
                [],
                session.getAsyncScriptTimeout(),
                function (result) {
                  assert.equal('Ghostdriver', result.value, 'title');
                  this.reload();
                });
              phantom.exit(1);
            });
          }
        });
      });
    });
  } else {
    console.log('No could open the url: ' + this.url);
    phantom.exit(1);
  }
});