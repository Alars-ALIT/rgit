var gitw = require("../lib/gitwalker.js");

exports.test1 = function(test) {

    test.expect(1);
   

	//console.log(gitw);
	
	var gw = gitw.walk("C:/dev/projects/wimii", "echo", function() {
		test.ok(true, "this assertion should pass");
		test.done();		
	});

}