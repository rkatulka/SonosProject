# Server to receive calls for sonos

## Setup

1. clone the directory
2. cd to home directory
3. npm install
4. create a file called passwords.htpasswd in the directory $HOME/data/.  Create your own usernames and passwords
4. node src/main/server/Server


## Current Functionality - Sept 5th 14:00 EST

1. localhost:port/ - Homepage
2. localhost:port/setup/setupSpeakers - Sets up the speakers it discovered when the server was started
3. localhost:port/setup/rediscover - Rediscovers speakers (need to rerun setupSpeakers)
4. localhost:port/info/getNumberOfSpeakers - Gets the number of speakers discovered
5. localhost:port/info/speakerInfo - The information about all of the speakers
6. localhost:port/:action/:deviceSelection - Performs an action on a deviceSelection
  a. Current actions: play, pause, stop
  b. Devices: common name that you made for your device on sonos

## Backlog - Sept 5th 14:00 EST

1. Auto-import groups from sonos for use within the application
2. Build the homepage (Currently only text from server)
3. TBD

## Goal

1. To integrate this application with a web gui, alexa and possibly a command line interface
2. Learn about a lot of stuff I have not had to deal with before
3. Implement as many sonos features as possible in an iterative fashion
