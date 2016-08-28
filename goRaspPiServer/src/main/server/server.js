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

var sonos = new SonosController(s);
sonos.discoverDevices();

app.use(auth.connect(basic));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());

app.get('/',function(req, res) {
  res.send('Hello, welcome to my api!\nHere is the current speaker information: ' + sonos.getSpeakerInfo());
});

app.get('/getNumberOfSpeakers', function(req, res) {
  res.send(sonos.getSpeakerInfo().length.toString());
});

app.get('/speakerInfo', function(req, res) {
  res.send(sonos.getSpeakerInfo());
})

app.get('/setupSpeakers', function(req, res) {
  var speakers = sonos.getSpeakerInfo();
  for (var i = 0; i < speakers.length; i++) {
    var tempSpeaker = new s.Sonos(speakers[i].speaker.ip);
    tempSpeaker.deviceDescription(function(err, info) {
      console.log(info.roomName);
      //console.log(info.friendlyName);
      //console.log(info.serviceList.service);
      //console.log(info.deviceList.device);
      var ipAddr = info.friendlyName.split(' ')[0];
      var speakers = sonos.getSpeakerInfo();
      for(var j = 0; j < speakers.length; j++) {
        if(ipAddr == speakers[j].speaker.ip) {
          speakers[j].speaker.name = info.roomName;
        }
      }
    });
  }
  res.send('Speakers set up!');
});

/*app.get('/admin/',function(req,res) {
  res.send('Welcome admin!');
});

app.get('/playLivingRoom/',function(req,res) {
  s.play(console.log);
  res.send('nice!');
})
app.get('/stopLivingRoom/',function(req,res) {
  s.stop(console.log);
  res.send('aww man!');
})*/

app.listen(port);
console.log('Listening on port 8000');

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
