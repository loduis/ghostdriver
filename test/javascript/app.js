var express = require('express'),
    http    = require('http'),
    path    = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
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
