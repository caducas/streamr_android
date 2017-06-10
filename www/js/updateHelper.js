function checkCompatibility() {
	if(useLocalAddress) {
		return getLocalUrl();
	}
	return getWebUrl();
}