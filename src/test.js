var Window = require('./window');
var win = new Window(10);
win.open('http://localhost:4567').wait(5000,
  function () {
    console.log('success');
    win.reload().wait(5000,
      function () {
        console.log('success');
      },
      function () {
        console.log('error');
      }
    );
  },
  function () {
    console.log('error');
  }
);
