function navigateBack() {
	if($('#page-artists-overview').is(':visible') ) {
		// alert("should show player now");
		showPlayer();
		return;
	}
	if($('#page-artist').is(':visible')) {
		// alert("should show all artists now");
		hideAll();
		showPlayerBar();
		$('#page-artists-overview').show();
		return;
	}
	if($('#page-album').is(':visible')) {
		// alert("should show artist now");
		showArtistPage();
		return;
	}
}