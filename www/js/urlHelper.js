var webAddress = {
	// address : 'streamr.no-ip.org',
	address : configHelper.getServerAddressWeb(),
	// port : '3000',
	port : configHelper.getServerPortWeb(),
	available : false
};
// var webAddressAvailable = true;
var localAddress = {
	// address : '192.168.8.80',
	address : configHelper.getServerAddressLocal(),
	// port : '3000',
	port : configHelper.getServerPortLocal(),
	available : true
};
// var localAddressAvailable = true;
var useLocalAddress = true;

function testConnection() {
	// console.log('testing connections');
	// testAvailableConnection(localAddress.address, localAddress.port, function(available) {
	// 	console.log('local address:' + available);
	// 	localAddress.available = available;
	// });
	// testAvailableConnection(webAddress.address, webAddress.port, function(available) {
	// 	console.log('web address:' + available);
	// 	webAddress.available = available;
	// });
}

function getUrl() {
	// $.ajax({
	// 	type: "POST",
	// 	url: 'http://'+localAddress,
	// 	crossDomain: true,
	// 	success: function(data) {
	// 		console.log('10.0.0.188');
	// 	},
	// 	error: function(data) {
	// 		console.log('streamr.no-ip.org');
	// 	}
	// });
	// if(localAddress.available == true) {
	if(useLocalAddress) {
		return getLocalUrl();
	}
	return getWebUrl();

	// console.log('returning web address');
	// return webAddress;
	// return localAddress;
}

function getLocalUrl() {
	console.log('retrieving local address');
	return localAddress.address + ':' + localAddress.port;
}

function getWebUrl() {
	console.log('retrieving web address');
	return webAddress.address + ':' + webAddress.port;
}

function useLocalSocket() {
	return useLocalAddress;
}