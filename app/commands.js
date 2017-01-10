var _      = require('lodash');
var moment = require('moment');
var bash   = require('helpers/bash');

module.exports = function(send) {
  var _commands = {};

  function register(name, fn) {
    if (send) {
      _commands[name] = fn;
    }
    else {
      _commands[name] = null;
    }
  };

  //////////////////////////////
  // WRITE YOUR COMMANDS HERE //
  //////////////////////////////

  register('take-picture', function(data) {
    var name = data.params.name || new Date().getTime() + '.jpg';

    bash.single('raspistill', '-o '+name, function(err, output) {
  
      if (err)
        return send.exception("Looks like the command `respstill` doesn't exist on this pi");

      return send.message(output);
    });
  });

  register('take-video', function(data) {
    var videoName = data.params.videoName || process.env.CLIENT_ID+'-'+getTimestamp();
    var duration = data.params.duration;

    send.update({
      status: 'working',
      description: 'Taking video ending in '+(duration/1000)+ 's'
    });

    var countdown = setInterval(function() {
      duration -= 1000;

      if (duration > 0) {
        send.update({
          status: 'working',
          description: 'Taking video ending in '+(duration/1000)+ 's'
        });
      }
      else {
        clearInterval(countdown);
      }
    }, 1000);

    var timer = setTimeout(function() {
      send.update({
        status: 'online',
        description: ''
      });
    }, duration);


    bash.single('raspivid', '-o '+videoName+'.mp4 -t '+duration, function(err, output) {
      if (err) {
        send.update({
          status: 'online',
          description: ''
        });

        clearInterval(countdown);
        clearTimeout(timer);
        return send.exception("Looks like the command `raspivid` doesn't exist on this pi");
      }

      return send.message(output);
    });

  })

  register('run-bash', function(data) {
    var bashParams = data.params.bash;

    send.update({
      status: 'working',
      description: 'Running bash command...'
    });

    bash.run(bashParams, function(err, result) {
      send.update({
        status: 'online',
        description: ''
      });

      if (err)
        return send.log(err.toString());
      
      return send.log(result.output);
    });
  });

   register('youtube-live', function(data) {
    var videoID = data.params.videoID;
    var width = data.params.width || '1280';
    var height = data.params.height || '720';
    var bitrate = data.params.bitrate || '400000';
    send.update({
       status: 'working',
       description: ''
       });
    bash.single('sh /home/pi/YouTube/arm/bin/youtubelivestream.sh '+width+' ' +height+' '+ bitrate+' '+ videoID, function(err, output){
      send.update({
        status: 'online',
        description: ''
      });

    if (err)
        return send.log(err.toString());
      
      return send.log(result.output);
    });
  });
  //////////////////////////////
  //  END YOUR COMMANDS HERE  //
  //////////////////////////////

  function getTimestamp() {
    return moment('MM-DD-YYYY_h|mm|ss_A');
  }

  var exists = function(name) {
    return (_.has(_commands, name) && _.isFunction(_commands[name]));
  };

  var run = function(name, data) {
    if (exists(name)) {
      return _commands[data['command']](data);
    }
    else {
      throw Error('Command not found: '+data['command']);
    }
  };

  var names = function() {
    return _.keys(_commands);
  }
  
  return {
    exists: exists,
    run: run,
    names: names
  };
};
