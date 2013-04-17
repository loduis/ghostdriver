var
    ghostdriver = require('./lib/ghostdriver'),
    session     = require('./lib/session').create(),
    win         = session.getWindow(),
    pageTimeout = session.getPageLoadTimeout();

win.open('http://localhost:4567/').wait(pageTimeout, function (status) {
  if (status === 'success') {
      this.find('#popup').wait(0, function (result) {

        console.log(JSON.stringify(result));
      });
      phantom.exit(1);
  } else {
    console.log('No could open the url: ' + this.url);
    phantom.exit(1);
  }
});