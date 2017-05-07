
function configHelper() {

	this.getUsername = function() {
		return localStorage.getItem("username");		
	}

	this.getPassword = function() {
		return localStorage.getItem("password");
	}

	this.setUsername = function(username) {
		localStorage.setItem("username", username);
	}

	this.setPassword = function(password) {
		var passwordEncrypted = CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
		localStorage.setItem("password", passwordEncrypted);
	}

	return this;
}