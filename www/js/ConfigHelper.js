
var configHelper = {
	getUsername: function() {
		return localStorage.getItem("username");		
	}, 
	getPassword: function() {
		return localStorage.getItem("password");
	}, 
	setUsername: function(username) {
		localStorage.setItem("username", username);
	}, 
	setPassword: function(password) {
		var passwordEncrypted = CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
		localStorage.setItem("password", passwordEncrypted);
	}
}