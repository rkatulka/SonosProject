/**
 * Search through the speakers for the speaker found
 *   with Levenshtein Distance
 *
 * @param room - The name of the speaker the user is trying to access
 * @param speakers - The list of the speakers from the sonosController prototype
 *
 * @return ip - The ip address of the speaker room
 */
exports.getSpeakerIp = function(room, speakers) {
  var ip = "";
  for(var i = 0; i < speakers.length; i++) {
    if(speakers[i].speaker.name == room.name)
      ip = speakers[i].speaker.ip;
  }
  return ip;
}

/**
 * Search through the speakers for the speaker found
 *   with Levenshtein Distance
 *
 * @Parameter group - The name of the group the user is trying to access
 * @Parameter speakers - The list of the speakers from the sonosController
 *   prototype
 *
 * @Return ip - The ip addresses of all the speakers in the group
 */
exports.getSpeakerIps = function(group, speakers) {
  var ips = [];
  for(var i = 0; i < speakers.length; i++) {
    if(speakers[i].speaker.group == group.name)
      ips.push(speakers[i].speaker.ip);
  }
  return ips;
}
