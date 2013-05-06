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

window.onkeypress = function (event) {
  //[shift, f]
  if (event.shiftKey && event.keyCode === 70) {
    location.href = '/frame';
  }
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

$('popup_post').addEventListener('click', function (event) {
  // send the form data to the popup
  var form   = document.forms[0];
  var target = 'new_window';
  var url    = '/popup';
  var action = form.action;
  window.open(url, target, 'width=350,height=250');
  form.target = 'new_window';
  form.action = url;
  form.submit();
  form.action = action;
  form.target = '';
});