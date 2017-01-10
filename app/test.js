var bash   = require('./helpers/bash');

var videoID = 'hddj-v4k6-tvjb-dm5u';
    var width ='1280';
    var height ='720';
    var bitrate ='4000000';

bash.run('sh /home/pi/YouTube/arm/bin/youtubelivestream.sh '+width+' ' +height+' '+ bitrate+' '+ videoID, function(err, output){
});