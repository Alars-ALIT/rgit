var walk = require('walk');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var colors = require('colors');
var events = require('events');
var util = require('util');
var queue = require("queue-async")(10);

var nrOfGitRoots = 0;
var nrOfGitErrors = 0;

function RGit(root, cmd, log, done) {
	events.EventEmitter.call(this);
	var me = this;
	walker = walk.walk(root, {followLinks: false, filters: ["target", ".git", "src"]});
	walker.on('directory', function (root, stat, next) {
		log("walking root: %s, stat: %j", root, stat.name);

		var isGitRoot = (stat.name == ".git" || stat.name == "_git"); // _git for testing..
		if(isGitRoot) {
			nrOfGitRoots++;
			queue.defer(me.doExec, cmd, root);
		} 
		next();
	});

	walker.on('end', function() {
		queue.awaitAll(function(error, results) {
			me.emit("allDone", {
									"root": root,
									"cmd": cmd
								});
		 	done({
		 		"nrOfGitRoots": nrOfGitRoots,
		 		"nrOfGitErrors": nrOfGitErrors
		 		});
		});
		
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

exports.walk = function(root, cmd, log, done) {
	return new RGit(root, cmd, log, done);
};
