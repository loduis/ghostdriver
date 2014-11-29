var Session = require('./session'),
    session  = new Session(),
    win     = session.getWindow();

win.open('http://phantomjs.org', function(status) {
  console.log(status);
  phantom.exit(1);
});