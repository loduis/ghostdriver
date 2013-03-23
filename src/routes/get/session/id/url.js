module.exports = function(window, session, request, response) {
  return window.eval('execute_script', 'return location.toString()');
};
