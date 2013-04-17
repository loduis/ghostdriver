function $(element) {
  return document.getElementById(element);
}


/*
window.addEventListener('contextmenu', function(event) {
  $('show_in_right_click').style.display = 'block';
  console.log('PRUEBA');
});*/

window.oncontextmenu = function (event) {
  $('show_in_right_click').style.display = 'block';
  //console.log('FIRE EVENT: ' + event.target.tagName);
};

window.onclick = function (event) {
  /*
  console.log(event.target.tagName);
  console.log('X: ' + event.pageX);
  console.log('Y: ' + event.pageY);
  console.log('BUTTON: ' + event.button);*/
};

$('alert').addEventListener('click', function () {
  /*
  if (confirm('This is a test.')) {
    console.log('OK..');
  } else {
    console.log('CANCEL..');
  }*/
})

// open new window
$('popup').addEventListener('click', function (event) {
  window.open('/popup','new_window','width=350,height=250');
});