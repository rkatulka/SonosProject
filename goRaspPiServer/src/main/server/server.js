var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var port = 8000;
var jwt = require('jwt-simple');
var auth = require('http-auth');
var s = require('sonos');
var q = require('q');
var basic = auth.basic({
  realm: 'Bobs Realm',
  file: __dirname + '/../../../data/passwords.htpasswd',
});

var SonosController = require('../classes/sonosController');
var singleRoomFunctions = require('../helperFunctions/singleRoomFunctions');

var sonosController = new SonosController(s);
sonosController.discoverDevices();

app.use(auth.connect(basic));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());

app.get('/',function(req, res) {
  res.send('Hello, welcome to my api!\nHere is the current speaker information: ' + sonosController.getSpeakerInfo());
});

app.get('/setup', function(req, res) {
  res.send(
    "In order to set up this server, call /setup/setupSpeakers.  If you would like to rediscover your speakers, call /setup/rediscover and then /setup/setupSpeakers.")
});

app.get('/getNumberOfSpeakers', function(req, res) {
  res.send(sonosController.getSpeakerInfo().length.toString());
});

app.get('/speakerInfo', function(req, res) {
  res.send(sonosController.getSpeakerInfo());
})

app.get('/setup/rediscover', function(req, res) {
  sonosController.discoverDevices();
  res.send('Speakers found!');
})

app.get('/setup/setupSpeakers', function(req, res) {
  sonosController.setSpeakerCommonNameAndGroup();
  res.send('Speakers set up!');
});

app.get('/action/play/:deviceSelection', function(req, res) {
  var devicePlaying = sonosController.actionByRoomOrGroup('play', req.params.deviceSelection);
  res.send('Now playing: ' + req.params.deviceSelection);
});

app.listen(port);
console.log('Listening on port 8000');

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
