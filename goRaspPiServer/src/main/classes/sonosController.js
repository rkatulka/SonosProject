var method = SonosController.prototype;
var async = require('async');
var levenshtein = require('../helperFunctions/levenshtein');

var speakerInfo = [];

function SonosController(sonos) {
  this._sonos = sonos;
  speakerInfo = [];
  lastPlayedDevices = "";
}

method.getSpeakerInfo = function() {
  return speakerInfo;
}

method.discoverDevices = function() {
  speakerInfo = [];
  this._sonos.search(function(device) {
    speakerInfo.push(
      { "speaker" :
        { "ip" : device.host,
          "name" : "",
          "group" : ""
        }
      }
    );
  });
}

method.play = function(deviceRequest) {
  var distances = [];
  var speakers = speakerInfo;
  compareToRooms(deviceRequest, distances, speakers);
  compareToGroups(deviceRequest, distances, speakers);
  var smallestDifference = getSmallestDifference(distances);

  return smallestDifference;
}

method.setSpeakerCommonNameAndGroup = function() {
  var speakers = this.getSpeakerInfo();
  var sonos = this._sonos;
  var thisPrototype = this;
  for (var i = 0; i < speakers.length; i++) {
    var tempSpeaker = new sonos.Sonos(speakers[i].speaker.ip);
    tempSpeaker.deviceDescription(function(err, info) {
      addIpInfoToSpeakerInfo(info, thisPrototype);
    });
  }
}

compareToRooms = function(deviceRequest, distances, speakers) {
  for(var i = 0; i < speakers.length; i++) {
    var name = speakers[i].speaker.name;
    var distance = levenshtein.getEditDistance(deviceRequest, name);
    distances.push({ name, distance });
  }
}

compareToGroups = function(deviceRequest, distances, speakers) {
  for(var j = 0; j < speakers.length; j++) {
    var group = speakers[j].speaker.group;
    var distance = levenshtein.getEditDistance(deviceRequest, group);
    distances.push({ group, distance });
  }
}

getSmallestDifference = function(distances) {
  var name = distances[0].name;
  var distance = distances[0].distance;
  for(var k = 0; k < distances.length; k++) {
    if(Object.keys(distances)[k] < distance) {
      distance = distances[k].distance;
      name = distances[k].name;
    }
  }
  return { name, distance}
}

addIpInfoToSpeakerInfo = function(info, sonosController) {
  var ipAddr = info.friendlyName.split(' ')[0];
  var speakers = sonosController.getSpeakerInfo();
  for(var i = 0; i < speakers.length; i++) {
    if(ipAddr == speakers[i].speaker.ip) {
      speakers[i].speaker.name = info.roomName;
    }
  }
}

module.exports = SonosController;
