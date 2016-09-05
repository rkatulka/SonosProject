var method = SonosController.prototype;
var async = require('async');
var levenshtein = require('../helperFunctions/levenshtein');
var actions = require('./sonosActions')

var speakerInfo = [];

/**
 * The constructor which will initialize the sonos library, speakerInfo and the
 *   lastPlayedDevices.
 *
 * @param sonos - The library needed to perform an action on a speaker
 */
function SonosController(sonos) {
  this._sonos = sonos;
  speakerInfo = [];
  lastPlayedDevices = "";
}

/**
 * Returns the list of speakers.  If none were discovered, then it will return
 *   an empty JSON.
 *
 * @return speakerInfo - The name, ip and group of all of the speakers
 */
method.getSpeakerInfo = function() {
  return speakerInfo;
}

/**
 * Find all of the speakers on the network and add their ip addresses to
 *   speakerInfo.
 */
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

/**
 *
 */
method.actionByRoomOrGroup = function(action, deviceRequest) {
  var distances = [];
  var speakers = speakerInfo;
  var sonos = this._sonos;

  compareRequestToRooms(deviceRequest, distances, speakers);
  compareRequestToGroups(deviceRequest, distances, speakers);
  var smallestDifference = getSmallestDifference(distances);
  selectAction(sonos, action, smallestDifference, speakers);

  return smallestDifference;
}

/**
 * Set the speaker name and the group the speaker belongs to.
 */
method.setSpeakerCommonNameAndGroup = function() {
  var speakers = this.getSpeakerInfo();
  var sonos = this._sonos;
  var thisPrototype = this;
  for (var i = 0; i < speakers.length; i++) {
    var tempSpeaker = new sonos.Sonos(speakers[i].speaker.ip);
    tempSpeaker.deviceDescription(function(err, info) {
      addRoomNameToSpeakerInfo(info, thisPrototype);
    });
  }
}

compareToRoomsAndGroups = function(deviceRequest, distances, speakers) {
  compareToRooms(deviceRequest, distances, speakers);
  compareToGroups(deviceRequest, distances, speakers);
}

/**
 * Using the Levenshtein distance, find the distance between each group and
 *   the input.
 */
compareRequestToRooms = function(deviceRequest, distances, speakers) {
  var type = 'speaker';
  for(var i = 0; i < speakers.length; i++) {
    var name = speakers[i].speaker.name;
    var distance = levenshtein.getEditDistance(deviceRequest, name);
    distances.push({ name, distance });
  }
}

/**
 * Using the Levenshtein distance, find the distance between each group and
 *   the input.
 */
compareRequestToGroups = function(deviceRequest, distances, speakers) {
  var type = 'group';
  for(var j = 0; j < speakers.length; j++) {
    var name = speakers[j].speaker.group;
    var distance = levenshtein.getEditDistance(deviceRequest, name);
    distances.push({ name, distance });
  }
}

/**
 * Get the room or group with the smallest distance.  The smallest distance will
 *  indicate the room or group that is most like the input.
 */
getRoomOrGroupIpsWithSmallestDifference = function(distances, speakers) {
  var smallestDifference = getSmallestDifference(distances);
  return getRoomOrGroupIps(smallestDifference, speakers);
}

getRoomOrGroupIps = function(smallestDifference, speakers) {
  var ips = [];
  for(var i = 0; i < speakers.length; i++) {
    if(smallestDifference.name == speakers[i].speaker.name) {
      var ip = speakers[i].speaker.ip
      ips.push({ ip });
    }
  }
  for(i = 0; i < speakers.length; i++) {
    if(smallestDifference.name == speakers[i].speaker.group) {
      var ip = speakers[i].speaker.ip;
      ips.push({ ip });
    }
  }
  return ips;
}

getSmallestDifference = function(distances) {
  var name = distances[0].name;
  var distance = distances[0].distance;
  var type = distances[0].type
  for(var k = 0; k < distances.length; k++) {
    if(distances[k].distance < distance) {
      distance = distances[k].distance;
      name = distances[k].name;
      type = distances[k].type;
    }
  }
  return { name, distance };
}

/**
 * Find the ip address that matches each speaker and assign the room name to
 *   that ip address.
 */
addRoomNameToSpeakerInfo = function(info, sonosController) {
  var ipAddr = info.friendlyName.split(' ')[0];
  var speakers = sonosController.getSpeakerInfo();
  for(var i = 0; i < speakers.length; i++) {
    if(ipAddr == speakers[i].speaker.ip) {
      speakers[i].speaker.name = info.roomName;
    }
  }
}

selectAction = function(sonos, action, roomOrGroupToActUpon, speakers) {
  switch(action)  {
    case 'play':
      actions.play(sonos, roomOrGroupToActUpon, speakers);
      break;
    case 'pause':
      actions.pause(sonos, roomOrGroupToActUpon, speakers);
      break;
    case 'stop':
      actions.stop(sonos, roomOrGroupToActUpon, speakers);
      break;
    default:
      return 'Invalid';
  }
  return action;
}

module.exports = SonosController;
