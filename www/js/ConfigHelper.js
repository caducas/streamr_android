
var configHelper = {
	getUsername: function() {
		return localStorage.getItem("username");		
	}, 
	getPassword: function() {
		return localStorage.getItem("password");
	}, 
	getServerAddressLocal: function() {
		return localStorage.getItem("server.local.address");
	}, 
	getServerAddressWeb: function() {
		return localStorage.getItem("server.web.address");
	}, 
	getServerPortLocal: function() {
		return localStorage.getItem("server.local.port");
	}, 
	getServerPortWeb: function() {
		return localStorage.getItem("server.web.port");
	}, 
	setUsername: function(username) {
		localStorage.setItem("username", username);
	}, 
	setPassword: function(password) {
		var passwordEncrypted = CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
		localStorage.setItem("password", passwordEncrypted);
	},
	setServerAddressLocal: function(serverAddress) {
		localStorage.setItem("server.local.address", serverAddress);
	},
	setServerAddressWeb: function(serverAddress) {
		localStorage.setItem("server.web.address", serverAddress);
	},
	setServerPortLocal: function(port) {
		localStorage.setItem("server.local.port", port);
	},
	setServerPortWeb: function(port) {
		localStorage.setItem("server.web.port", port);
	},
	checkSettings: function() {
		if(this.getUsername() == null) {
			return false;
		}
		if(this.getPassword() == null) {
			return false;
		}
		if(this.getServerAddressLocal() == null) {
			return false;
		}
		if(this.getServerAddressWeb() == null) {
			return false;
		}
		if(this.getServerPortLocal() == null) {
			return false;
		}
		if(this.getServerPortWeb() == null) {
			return false;
		}
		return true;
	}
}