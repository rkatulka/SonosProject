exports.play = function(roomOrGroupToActUpon, speakers) {
  if(roomOrGroupToActUpon.type == 'speaker') {
    playSpeaker();
  } else {
    playGroup();
  }
}

exports.pause = function(roomOrGroupToActUpon, speakers) {

}

exports.stop = function(roomOrGroupToActUpon, speakers) {

}

playSpeaker = function(speakerIp) {
  console.log('speaker');
}

pauseSpeaker = function(speakerIp) {

}

stopSpeaker = function(speakerIp) {

}

playGroup = function(speakerIps) {
  console.log('group');
}

pauseGroup = function(speakerIps) {

}

stopGroup = function(speakerIps) {

}