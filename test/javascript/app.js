var express = require('express'),
    http    = require('http'),
    path    = require('path');

var app = express();
var favicon = require('serve-favicon');
var morgan  = require('morgan');
var bodyParser = require('body-parser')
var errorhandler = require('errorhandler')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// a pre-defined name
morgan('combined');

// a format string
morgan(':remote-addr :method :url');

// a custom function
morgan(function (tokens, req, res) {
  return req.method + ' ' + req.url
});

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler())
  app.locals.pretty = true;
}

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/frame', function (req, res) {
  res.render('frame');
});

app.get('/leftframe', function (req, res) {
  res.render('leftframe');
});

app.get('/rightframe', function (req, res) {
  res.render('rightframe');
});

app.get('/iframe', function (req, res) {
  res.render('iframe');
});

app.get('/popup', function (req, res) {
  res.render('popup', {q: 'This is an method GET'});
});

app.post('/popup', function (req, res) {
  res.render('popup', {q: req.body.q});
});

app.post('/submit', function (req, res) {
  setTimeout(function() {
   res.render('submit');
  }, 1000);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
