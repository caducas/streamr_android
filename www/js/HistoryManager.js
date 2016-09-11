function navigateBack() {
	if($('page-artists-overview').is(':visible') ) {
		showPlayer();
		return;
	}
	if($('page-artist').is(':visible')) {
		hideAll();
		showPlayerBar();
		$('#page-artists-overview').show();
		return;
	}
	if($('page-album').is(':visible')) {
		showArtistPage();
		return;
	}
}