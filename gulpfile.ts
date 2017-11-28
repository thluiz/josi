// Include gulp
var gulp = require('gulp');
var exec = require('child_process').exec;
const rename = require('gulp-rename');

var fs = require('fs');

function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
}

gulp.task('build', function (cb) {
    exec('cd apex && ng build', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
});

gulp.task('moveAngular2Public', ['build'], function (cb) {
    var ncp = require('ncp').ncp;    
    
    ncp('apex/dist', "public", function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('done!');
    });   
});

gulp.task('commit', (cb) => {
    var argv = require('yargs').argv;
    var commit = argv.c;

    exec(`git add . -A && git commit -m '${commit}'`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('push', ['commit'], (cb) => {    
    exec(`git push -u origin master`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('publish', ['push'], function(cb) {
    
})

// Default Task
gulp.task('default', ['publish']);