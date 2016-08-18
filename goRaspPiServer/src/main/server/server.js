var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var port = 8000;
var jwt = require('jwt-simple');
var auth = require('http-auth');
var sonos = require('sonos');
var basic = auth.basic({
  realm: 'Bobs Realm',
  file: __dirname + '/../../../data/passwords.htpasswd',
  //authType: 'basic'
});

var s = new sonos.Sonos('192.168.1.180');
s.currentTrack(console.log);
app.use(auth.connect(basic));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());

app.get('/',function(req, res) {
  res.send('Hello, welcome to my api!');
});

app.get('/admin/',function(req,res) {
  res.send('Welcome admin!');
});

app.get('/playLivingRoom/',function(req,res) {
  s.play(console.log);
  res.send('nice!');
})
app.get('/stopLivingRoom/',function(req,res) {
  s.stop(console.log);
  res.send('aww man!');
})

app.listen(port);
console.log('Listening on port 8000');
