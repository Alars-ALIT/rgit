var walk = require('walk');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var nrOfGitRoots = 0;

exports.walk = function(root, cmd, done) {
	walker = walk.walk(root, {followLinks: false, filters: ["target", ".git", "src"]});
	walker.on('directory', function (root, stat, next) {
		var isGitRoot = stat.name == ".git";
		if(isGitRoot) {
			nrOfGitRoots++;
			exec(cmd, {cwd: root},  function(error, stdout, stderr) {
				console.log('[git-root]', root);
				if(error) {
					console.log("git error: %s, %s", error, stderr);
				}
				
				if(stdout) {
					var lines = stdout.toString().split('\n');					
					for(i in lines) {
						var line = lines[i]; 
						console.log(line);
					}
				}
	    		next();	
			});
		} else {
			next();	
		}
		
	});

	 walker.on("end", function () {
	 	done(nrOfGitRoots);
	 });
}
