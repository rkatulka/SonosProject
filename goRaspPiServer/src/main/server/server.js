var SonosController = require('../classes/sonosController');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt = require('jwt-simple');
var auth = require('http-auth');
var s = require('sonos');
var q = require('q');
var port = 8000;
var basic = auth.basic({
  realm: 'Bobs Realm',
  file: __dirname + '/../../../data/passwords.htpasswd',
});

var sonosController = new SonosController(s);
sonosController.discoverDevices();

var app = express();
app.use(auth.connect(basic));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// Main page
app.get('/',function(req, res) {
  res.send('Hello, welcome to my api!\nHere is the current speaker information: ' + sonosController.getSpeakerInfo());
});

/****************************************

  Setup for the speakers and server.

****************************************/
app.get('/setup', function(req, res) {
  res.send('In order to set up this server, call /setup/setupSpeakers.  If you would like to rediscover your speakers, call /setup/rediscover and then /setup/setupSpeakers.');
});

app.get('/setup/setupSpeakers', function(req, res) {
  sonosController.setSpeakerCommonNameAndGroup();
  res.send('Speakers set up!');
});

app.get('/setup/rediscover', function(req, res) {
  sonosController.discoverDevices();
  res.send('Speakers found!');
});

/****************************************

  Info about the server and the speakers

****************************************/
app.get('/info/getNumberOfSpeakers', function(req, res) {
  res.send(sonosController.getSpeakerInfo().length.toString());
});

app.get('/info/speakerInfo', function(req, res) {
  res.send(sonosController.getSpeakerInfo());
});

/****************************************

  Actions to perform on the speakers

****************************************/
app.get('/action/:action/:deviceSelection', function(req, res) {
  var devicePlaying = sonosController.actionByRoomOrGroup(req.params.action, req.params.deviceSelection);
  res.send('Now playing: ' + devicePlaying.name);
});

app.listen(port);
console.log('Listening on port 8000');
