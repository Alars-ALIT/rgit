var gitw = require("../lib/gitwalker.js");

exports.test1 = function(test) {
	var path = process.cwd();
	console.log("Testing path %s", path);
	var gw = gitw.walk(path, "echo", console.log, function(status) {		
		test.equal(status.nrOfGitRoots, 1, "Did not find correct nr of git roots");
		test.equal(status.nrOfGitErrors, 0);
		test.done();				
	});

}