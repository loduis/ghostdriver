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
  var element = event.target;
  console.log(element.tagName);
  console.log('X: ' + event.clientX);
  console.log('Y: ' + event.clientY);
  console.log('BUTTON: ' + event.button);
  $('output').innerHTML = 'X: ' + event.clientX + "<br>" +
      'Y: ' + event.clientY + "<br>" +
      'H: ' + element.clientWidth + "<br>" +
      'W: ' + element.clientHeight;
};

window.onkeypress = function (event) {
  //[shift, f]
  if (event.shiftKey && event.keyCode === 70) {
    location.href = '/frame';
  }
};
// phantomjs crash with change to new window
// if you remove this line
window.onmousemove = function (event) {
  console.log('tagName: ' + event.target.tagName);
  console.log('id: ' + event.target.id);
  console.log('X: ' + event.clientX);
  console.log('Y: ' + event.clientY);
  console.log('-----------------------------');
};


document.getElementById('alert').addEventListener('click', function () {
  /*
  if (confirm('This is a test.')) {
    console.log('OK..');
  } else {
    console.log('CANCEL..');
  }*/
});

// open new window
document.getElementById('popup').addEventListener('click', function (event) {
  window.open('/popup','new_window','width=350,height=250');
});

document.getElementById('popup_post').addEventListener('click', function (event) {
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
document.getElementById('receiver').addEventListener('click', function (event) {
  var element = event.target;
  if (element.id === 'sender') {
    element.setAttribute('is_sender', 'true');
  }
});