var gitw = require("../gitwalker.js");

exports.test1 = function(test) {

    test.expect(1);
	gitw.walk("C:/dev/projects/wimii", "git status -sb", function() {
    	test.ok(true, "this assertion should pass");
		test.done();		
	});

}