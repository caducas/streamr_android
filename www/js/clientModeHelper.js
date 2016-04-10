var nodeWebkitMode = (typeof process == "object");

if(isNodeWebkit) {
  var configHelper = require(process.cwd() + '/ConfigHelper');
}

function isNodeWebkit() {
	return nodeWebkitMode;
}