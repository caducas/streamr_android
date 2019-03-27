function navigateBack() {
	if($('#songOptionsArea').is(':visible')) {
		hideSongOptions();
		return;		
	}
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
		$('#page-artists-overview-scrollnav').show();
		return;
	}
	if($('#page-album').is(':visible')) {
		// alert("should show artist now");
		showArtistPage();
		return;
	}
	if($('#page-search').is(':visible')) {
		showPlayer();
		return;
	}
	if($('#page-playlists-overview').is(':visible')) {
		hidePlaylistsPage();
		return;
	}
	if($('#settingsMenuArea').is(':visible')) {
		hideSettingsMenu();
		return;
	}
	if($('#mpdSelectionArea').is(':visible')) {
		hideMpdSelection();
		return;
	}
	if($('#page-playlist-current').is(':visible')) {
		showPlayer();
		return;
	}
}