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
	return configHelper.getServerAddressLocal() + ':' + configHelper.getServerPortLocal();
}

function getWebUrl() {
	console.log('retrieving web address');
	return configHelper.getServerAddressWeb() + ':' + configHelper.getServerPortWeb();
}

function useLocalSocket() {
	return useLocalAddress;
}