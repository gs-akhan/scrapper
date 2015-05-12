var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var query = require('url')
var cheerio = require('cheerio');
var request = require('request');

var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(function (req,res,next) {
    req.qp = query.parse(req.url,true).query;
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getgenre', function (req, res) {
  console.log(path.join("http://www.imdb.com/title/",req.qp.title));
  console.log("DATA HERE");
  console.log(req.body);
  request("http://www.imdb.com/title/"+req.qp.title, function (error, response, body) {
    var $ = cheerio.load(body);
    var genresArr = [];
    $("div[itemprop=genre] a").each(function(ele) {
      genresArr.push($(this).text());
    });
    res.json({
      title : req.qp.title,
      genre : genresArr.toString().replace(/\s/g, "")
    });
    
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
