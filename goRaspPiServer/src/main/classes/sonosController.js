var method = SonosController.prototype;
var async = require('async');

var speakerInfo = [];

function SonosController(sonos) {
  this._sonos = sonos;
  speakerInfo = [];
}

method.getSpeakerInfo = function() {
  return speakerInfo;
}

method.discoverDevices = function() {
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

module.exports = SonosController;
