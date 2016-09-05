var speakerRecognition = require('../helperFunctions/speakerRecognition');

/**
 * Gets the ip of the speakers needed and selects the playSpeaker or playGroup function
 *
 * @param sonos - The sonos library imported by the server that is needed to run
 *   a command on Sonos
 * @param roomOrGroupToActUpon - The name of the room or group to act on
 @ @param speakers - The list of speakers fromt he sonosController prototype
 */
exports.play = function(sonos, roomOrGroupToActUpon, speakers) {
  if(roomOrGroupToActUpon.type == 'speaker') {
    var speakerIp = speakerRecognition.getSpeakerIp(roomOrGroupToActUpon, speakers);
    playSpeaker(sonos, speakerIp);
  } else {
    var speakerIps = speakerRecognition.getSpeakerIps(roomOrGroupToActUpon, speakers);
    playGroup(sonos, speakerIps);
  }
}

/**
 * Gets the ip of the speakers needed and selects the pauseSpeaker or pauseGroup function
 *
 * @param sonos - The sonos library imported by the server that is needed to run
 *   a command on Sonos
 * @param roomOrGroupToActUpon - The name of the room or group to act on
 @ @param speakers - The list of speakers fromt he sonosController prototype
 */
exports.pause = function(sonos, roomOrGroupToActUpon, speakers) {
  if(roomOrGroupToActUpon.type == 'speaker') {
    var speakerIp = speakerRecognition.getSpeakerIp(roomOrGroupToActUpon, speakers);
    pauseSpeaker(sonos, speakerIp);
  } else {
    var speakerIps = speakerRecognition.getSpeakerIps(roomOrGroupToActUpon, speakers);
    pauseGroup(sonos, speakerIps);
  }
}

/**
 * Gets the ip of the speakers needed and selects the stopSpeaker or stopGroup function
 *
 * @param sonos - The sonos library imported by the server that is needed to run
 *   a command on Sonos
 * @param roomOrGroupToActUpon - The name of the room or group to act on
 @ @param speakers - The list of speakers fromt he sonosController prototype
 */
exports.stop = function(sonos, roomOrGroupToActUpon, speakers) {
  if(roomOrGroupToActUpon.type == 'speaker') {
    var speakerIp = speakerRecognition.getSpeakerIp(roomOrGroupToActUpon, speakers);
    stopSpeaker(sonos, speakerIp);
  } else {
    var speakerIps = speakerRecognition.getSpeakerIps(roomOrGroupToActUpon, speakers);
    stopGroup(sonos, speakerIps);
  }
}

/**
 * Plays a speaker
 *
 * @param sonos - The sonos library used for calling an action on a speaker
 * @param speakerIp - The ip of the speaker to perform an action on
 */
playSpeaker = function(sonos, speakerIp) {
  var s = new sonos.Sonos(speakerIp);
  s.play(function(err, playing) {
    console.log([err, playing]);
  });
}

/**
 * Pauses a speaker
 *
 * @param sonos - The sonos library used for calling an action on a speaker
 * @param speakerIp - The ip of the speaker to perform an action on
 */
pauseSpeaker = function(sonos, speakerIp) {
  var s = new sonos.Sonos(speakerIp);
  s.pause(function(err, playing) {
    console.log([err, playing]);
  });
}

/**
 * Stops a speaker
 *
 * @param sonos - The sonos library used for calling an action on a speaker
 * @param speakerIp - The ip of the speaker to perform an action on
 */
stopSpeaker = function(sonos, speakerIp) {
  var s = new sonos.Sonos(speakerIp);
  s.stop(function(err, playing) {
    console.log([err, playing]);
  });
}

/**
 * Plays a group
 *
 * @param sonos - The sonos library used for calling an action on a speaker
 * @param speakerIps - The ip of the speakers to perform an action on
 */
playGroup = function(sonos, speakerIps) {
  for(var i = 0; i < speakerIps.length; i++) {
    var s = new sonos.Sonos(speakerIps[i]);
    s.play(function(err, playing) {
      console.log([err, playing]);
    });
  }
}

/**
 * Pauses a group
 *
 * @param sonos - The sonos library used for calling an action on a speaker
 * @param speakerIps - The ip of the speakers to perform an action on
 */
pauseGroup = function(sonos, speakerIps) {
  for(var i = 0; i < speakerIps.length; i++) {
    var s = new sonos.Sonos(speakerIps[i]);
    s.pause(function(err, playing) {
      console.log([err, playing]);
    });
  }
}

/**
 * Stops a group
 *
 * @param sonos - The sonos library used for calling an action on a speaker
 * @param speakerIps - The ip of the speakers to perform an action on
 */
stopGroup = function(sonos, speakerIps) {
  for(var i = 0; i < speakerIps.length; i++) {
    var s = new sonos.Sonos(speakerIps[i]);
    s.stop(function(err, playing) {
      console.log([err, playing]);
    });
  }
}
