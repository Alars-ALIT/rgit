var walk = require('walk');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var colors = require('colors');
var events = require('events');
var util = require('util');

var nrOfGitRoots = 0;
var nrOfGitErrors = 0;
var processedRoots = 0;
var walkDone = false;

function RGit(root, cmd, done) {
	events.EventEmitter.call(this);
	var me = this;
	walker = walk.walk(root, {followLinks: false, filters: ["target", ".git", "src"]});
	walker.on('directory', function (root, stat, next) {
		var isGitRoot = stat.name == ".git";
		if(isGitRoot) {
			nrOfGitRoots++;
			me.doExec(cmd, root, function() {
				me.emit("rootDone", {
										"root": root,
										"cmd": cmd
									});
			});
		} 
		next();
	});

	walker.on('end', function() {
		walkDone = true;
	});

	this.on("rootDone", function (status) {
	 	processedRoots++;
	 	if(processedRoots == nrOfGitRoots && walkDone) {
		 	me.emit("allDone", {
									"root": root,
									"cmd": cmd
								});
		 	done({
		 		"nrOfGitRoots": nrOfGitRoots,
		 		"nrOfGitErrors": nrOfGitErrors
		 		});
			
		}
	 });
}

util.inherits(RGit, events.EventEmitter);

RGit.prototype.doExec = function(cmd, root, done) {
	exec(cmd, {cwd: root},  function(error, stdout, stderr) {
		console.log('[git-root] %s'.bold.white, root);
		if(error) {
			console.log("git error: %s, %s".red, error, stderr);
			nrOfGitErrors++;
		} else if(stdout) {
			var lines = stdout.toString().split('\n');					
			for(i in lines) {
				var line = lines[i]; 
				console.log(line.grey);
			}
		}
		done();
	});
}

exports.walk = function(root, cmd, done) {
	return new RGit(root, cmd, done)
};
