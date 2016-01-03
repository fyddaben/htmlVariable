/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.set('port', 3000 );
app.set('views', __dirname + '/view');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', {it: 'daben'});
});

var server=http.createServer(app).listen(app.get('port'), function(){

  console.log("Express server listening on port " + app.get('port'));

});


