var volumeBarShowDate;
var songOptionsSongData = {
	id:undefined,
	title:undefined,
	artist:undefined,
	album:undefined,
	isFlac:undefined
};
var artistOptionsData = {
	artistId:undefined
}
var albumOptionsData = {
	albumId:undefined
}
var playlistSongOptionsSongData = {
	index:undefined
}
var playlistSelectionFunction;

function showStreamr() {
	hideAll();
	$('#streamr').show();
	$('#loadingPage').hide();
	showPlayer();
}

function setAutocompleteResult(resultList) {
	console.log(resultList);
	$("#search-result-area").empty();

	var divArtists = $('<div></div>');
	var divAlbums = $('<div></div>');
	var divSongs = $('<div></div>');

	var divArtistsHeadline = $('<div></div>').append('Artists');
	var divAlbumsHeadline = $('<div></div>').append('Albums');
	var divSongsHeadline = $('<div></div>').append('Songs');

	divArtists.append(divArtistsHeadline);
	divAlbums.append(divAlbumsHeadline);
	divSongs.append(divSongsHeadline);

	for(var i in resultList) {

		var divEntry = $('<div></div>');
		var divEntryImage = $('<img>');

		var imagePath=parseUrl("http://"+getUrl()+"/media/"+resultList[i].imagepath+"/");

		if(resultList[i].category=="Artists") {
			divEntryImage.attr('src', imagePath+"artistSmall.jpg");
		} else {
			divEntryImage.attr('src', imagePath+"albumSmall.jpg");
		}

		divEntry.append(divEntryImage);
		(function(category, id){
			divEntry.on("click", function() {
				console.log('will search for '+category+' with id '+id);
				if(category == "Albums") {
					getAlbum(id);
					return;
				}
				if(category == "Artists") {
					getArtistWithId(id);
					return;
				}
				if(category == "Songs") {
					getSong(id);
					return;
				}
			});
		})(resultList[i].category, resultList[i].id);
		divEntry.append(resultList[i].label);
		if(resultList[i].category=="Artists") divArtists.append(divEntry);
		if(resultList[i].category=="Albums") divAlbums.append(divEntry);
		if(resultList[i].category=="Songs") divSongs.append(divEntry);

	}

	$("#search-result-area").append(divArtists);
	$("#search-result-area").append(divAlbums);
	$("#search-result-area").append(divSongs);
}

function frontendPlay() {
	$('#btnPlay').hide();
	$('#btnPause').show();
	$('#player-current-title').text($("#jquery_jplayer_1").data("jPlayer").status.media.title);
	$('#player-bar-title').text($("#jquery_jplayer_1").data("jPlayer").status.media.title);
	$('#player-current-artist').text($("#jquery_jplayer_1").data("jPlayer").status.media.artist);
	$('#player-bar-artist').text($("#jquery_jplayer_1").data("jPlayer").status.media.artist);
}

function frontendPause() {
	$('#btnPause').hide();
	$('#btnPlay').show();
}


function isRandomActive() {
	return !$('#btnShuffle').hasClass('inactive');
}

function isRepeatActive() {
	return !$('#btnRepeat').hasClass('inactive');
}

function isVolumeMuted() {
	return $('#btnMute').hasClass("glyphicon-volume-off");
}

function showArtist(data) {
	artistOptionsData = data;
	console.log('show artist page');
	$('#albumList').empty();

	$('#artist-page-headline-image').empty();
	var artistImage = document.createElement('img');
	artistImage.src = "http://"+getUrl()+"/media/"+data.artist+"/artist.jpg";
	$('#artist-page-headline-image').append(artistImage);

	$('#artist-page-artist-name').empty();
	var artistName = document.createTextNode(data.artist);
	$('#artist-page-artist-name').append(artistName);
	// document.getElementById("artist-page-artist-name").html = data.artist;
	if(artistOptionsData.likeCode > 0) {
		$('#likeArtist').show();
		$('#dislikeArtist').hide();
		$('#unlikeArtist').hide();
		$('#undislikeArtist').show();
	} else {
		if(artistOptionsData.likeCode < 0) {
			$('#likeArtist').hide();
			$('#dislikeArtist').show();
			$('#unlikeArtist').show();
			$('#undislikeArtist').hide();
		} else {
			$('#likeArtist').hide();
			$('#dislikeArtist').hide();
			$('#unlikeArtist').show();
			$('#undislikeArtist').show();			
		}
	}

	for(var i in data.albums) {
		console.log(data.albums[i]);

		var album = data.albums[i];

		var divAlbumRow = document.createElement('div');
		divAlbumRow.className='row';
		divAlbumRow.id = 'albumList_'+data.albums[i].id;

		(function(id){
			divAlbumRow.addEventListener("click", function() {
				console.log('will open album with id '+id);
				getAlbum(id);
			});
		})(data.albums[i].id);

		console.log('will add album');

	    var divAlbumImage = document.createElement('div');
	    divAlbumImage.className='albumImage';

	    var albumImage = document.createElement('img');
	    albumImage.src =parseUrl("http://"+getUrl()+"/media/"+data.artist+"/"+data.albums[i].name+"/albumMedium.jpg");
	    divAlbumImage.appendChild(albumImage);

	    divAlbumRow.appendChild(divAlbumImage);

	    var divAlbumInfo = document.createElement('div');
	    divAlbumInfo.className = 'albumInfo';

	    var divAlbumTitle = document.createElement('div');
	    divAlbumTitle.className = 'albumTitle';
	    divAlbumTitle.innerHTML = data.albums[i].name;
	    divAlbumInfo.appendChild(divAlbumTitle);

		var divAlbumLike = document.createElement('div');
		if(data.albums[i].likeCode > 0) {
			divAlbumLike.className = 'glyphicon glyphicon-heart albumLike';
		} else {
			if(data.albums[i].likeCode < 0) {
				divAlbumLike.className = 'glyphicon glyphicon-ban-circle albumLike';
			} else {
				divAlbumLike.className = 'albumLike';
			}
		}
		divAlbumInfo.appendChild(divAlbumLike);

	    var divAlbumSongCount = document.createElement('div');
	    divAlbumSongCount.className = 'songCount';
	    divAlbumSongCount.innerHTML = data.albums[i].songs.length + " Songs";
	    divAlbumInfo.appendChild(divAlbumSongCount);

	    var divAlbumYear = document.createElement('div');
	    divAlbumYear.className = 'albumYear';
	    divAlbumYear.innerHTML = data.albums[i].year;
	    divAlbumInfo.appendChild(divAlbumYear);

	    divAlbumRow.appendChild(divAlbumInfo);

		$('#albumList').append(divAlbumRow);
	}
	showArtistPage();
}

function showAlbum(data) {

	albumOptionsData = data;

	//TODO Background album image

	document.getElementById("page-album-title").innerHTML = data.albumName;
	document.getElementById("page-album-artist").innerHTML = data.artistName;
	document.getElementById("page-album-songcount").innerHTML = data.songs.length + " Songs";

	$('#page-album-headline-image').empty();
	var artistImage = document.createElement('img');
	artistImage.src = parseUrl("http://"+getUrl()+"/media/"+data.artistName+"/"+data.albumName+"/albumMedium.jpg");
	$('#page-album-headline-image').append(artistImage);

	if(data.likeCode > 0) {
		$('#likeAlbum').show();
		$('#dislikeAlbum').hide();
		$('#unlikeAlbum').hide();
		$('#undislikeAlbum').show();
	} else {
		if(data.likeCode < 0) {
			$('#likeAlbum').hide();
			$('#dislikeAlbum').show();
			$('#unlikeAlbum').show();
			$('#undislikeAlbum').hide();
		} else {
			$('#likeAlbum').hide();
			$('#dislikeAlbum').hide();
			$('#unlikeAlbum').show();
			$('#undislikeAlbum').show();			
		}
	}

	$('#page-album-playlist').empty();

	for(var i in data.songs) {

		var divSongRow = document.createElement('div');
		divSongRow.className = "list-element song";

		//TODO Listener

		var divSongTitle = document.createElement('div');
		divSongTitle.innerHTML = data.songs[i].title;
		divSongTitle.className = "page-album-song-title";

	    (function(songs, albumName, artistName, playPosition){
	      divSongTitle.addEventListener("click", function() {
	        createNewPlaylist();

	        for(var songcount in songs) {
	            addToPlaylist(songs[songcount].id, songs[songcount].title,albumName,artistName,songs[songcount].storagePath,songs[songcount].isFlac, songs[songcount].likeCode);
	        }
	        modifyPlaylistDesign();
	        play(playPosition);
	      }, false);
	    })(data.songs, data.albumName, data.artistName, i);
	    console.log('should add song to playlist view with index:'+i+' song:');
	    console.log(data.songs[i]);

		divSongRow.appendChild(divSongTitle);

		var divLikeSong = document.createElement('div');
		divLikeSong.className = "page-album-song-like";
		if(data.songs[i].likeCode==1) {
			divLikeSong.innerHTML = '<span class="glyphicon glyphicon-heart"></span>';
		} else {
			divLikeSong.innerHTML = '<span class="glyphicon glyphicon-heart-empty inactive"></span>';
		}

		(function(id){
			divLikeSong.addEventListener("click", function() {
				var self = this;
				if($(self).find("span.glyphicon").hasClass( "inactive" )) {
					sendLikeSong(id);
					$(self).find("span.glyphicon").removeClass("glyphicon-heart-empty inactive").addClass("glyphicon-heart");
				} else {
					sendUnlikeSong(id);
					$(self).find("span.glyphicon").removeClass("glyphicon-heart").addClass("glyphicon-heart-empty inactive");
				}
			});
		})(data.songs[i].id);

		divSongRow.appendChild(divLikeSong);

		var divAddSongToPlaylist = document.createElement('div');
		divAddSongToPlaylist.className = "page-album-song-add";
		// divAddSongToPlaylist.appendChild(document.createElement('span'))
		divAddSongToPlaylist.innerHTML = '<span class="glyphicon glyphicon-option-vertical"></span>';

		(function(id, title, album, artist, isFlac){
			divAddSongToPlaylist.addEventListener("click", function() {
	        	songOptionsSongData.id = id;
	        	songOptionsSongData.title = title;
	        	songOptionsSongData.album = album;
	        	songOptionsSongData.artist = artist;
	        	songOptionsSongData.isFlac = isFlac;
	        	showSongOptions();

			});
		})(data.songs[i].id,data.songs[i].title,data.albumName,data.artistName,data.songs[i].isFlac);

		//TODO Listener
		divSongRow.appendChild(divAddSongToPlaylist);
		$('#page-album-playlist').append(divSongRow);

		// var divAddSongToPlaylist = document.createElement('div');
		// // divAddSongToPlaylist.appendChild(document.createElement('span'))
		// divAddSongToPlaylist.innerHTML = '<span class="glyphicon glyphicon-play"></span>';
	}

	console.log('should show album page');
	console.log(data);
	showAlbumPage();

	// strangefully the scrolltop set function is only working after value was retrieved (with get function)
	if($('#page-album').scrollTop()>0)	$('#page-album').scrollTop(0);
}

function showPlaylist() {
	hideAll();
    $('#page-playlist-current').show();
    showPlayerBar();
}

function showPlayer() {
	hideAll();
	$('#page-player').show();
}

function showSearch() {
	hideAll();
	showPlayerBar();
	$('#page-search').show();
	$('#search').val('');
	$('#search').focus();
}

function showArtistsPage() {
	getArtists();
}

function showPlaylistsPage() {
	getPlaylists();
}

function hidePlaylistsPage() {
	$('#page-playlists-overview').hide();
	if($('#page-player').is(':visible')) {
		hidePlayerBar();
	}
}

function showArtists(data) {
	hideAll();
	showPlayerBar();
	$('#page-artists-overview').show();

	$('#page-artists-overview').empty();

	$('#page-artists-overview-scrollnav').show();

	$('#page-artists-overview-scrollnav').empty();

	var prevArtistLetter = "";

	console.log('data:');
	console.log(data);
	for(var i in data) {
		var artistLetter = data[i].name.charAt(0).toUpperCase();
		if(artistLetter != prevArtistLetter) {
			prevArtistLetter = artistLetter;
			var letterHeadline = document.createElement('div');
			letterHeadline.className = 'listHeadline';
			letterHeadline.id = 'listHeadline-'+prevArtistLetter;
			letterHeadline.appendChild(document.createTextNode(prevArtistLetter));
			$('#page-artists-overview').append(letterHeadline);

			var scrollnavLetter = document.createElement('div');
			scrollnavLetter.appendChild(document.createTextNode(prevArtistLetter));

			(function(id){
				scrollnavLetter.addEventListener("click", function() {
					scrollToAnchor(id);
				}, false);
			})(prevArtistLetter);

			$('#page-artists-overview-scrollnav').append(scrollnavLetter);
		}

		var artistEntry = document.createElement('div');
		artistEntry.className = 'list-element artist';
		artistEntry.id = 'artistList_'+data[i].name;

		var imageElement = document.createElement('img');
		imageElement.src = encodeURI('http://'+getUrl()+'/media/' + data[i].name + '/artistSmall.jpg');
		imageElement.onerror = function() {
		  this.onerror=null;
		  this.src='';
		}
		artistEntry.appendChild(imageElement);

		var artistName = document.createElement('div');
		artistName.className = 'artistName';
		artistName.appendChild(document.createTextNode(data[i].name));
		artistEntry.appendChild(artistName);

		var artistLikeIcon = document.createElement('div');
		if(data[i].like_code > 0) {
			artistLikeIcon.className = 'glyphicon glyphicon-heart artistLike';			
		} else {
			if(data[i].like_code < 0) {
				artistLikeIcon.className = 'glyphicon glyphicon-ban-circle artistLike';	
			} else {
				artistLikeIcon.className = 'artistLike';					
			}
		}
		artistEntry.appendChild(artistLikeIcon);

		(function(id){
		artistEntry.addEventListener("click", function() {
		  getArtistWithId(id);
		}, false);
		})(data[i].id);

		$('#page-artists-overview').append(artistEntry);
	}
}

function showPlaylists(data) {

	console.log('data:');
	console.log(data);
	if($('#page-player').is(':visible')) {
		// hideAll();
		showPlayerBar();
	}
	$('#page-playlists-overview').show();

	$('#page-playlists-list').empty();

	for(var i in data) {

		var playlistEntry = document.createElement('div');
		playlistEntry.className = 'list-element playlist';

		console.log(data[i].name);
		var playlistName = document.createElement('div');
		playlistName.appendChild(document.createTextNode(data[i].name));
		playlistEntry.appendChild(playlistName);

		(function(id){
		playlistEntry.addEventListener("click", function() {
			playlistSelectionFunction(id);
		  	// getPlaylistWithId(id);
		}, false);
		})(data[i].id);

		$('#page-playlists-list').append(playlistEntry);
	}
}


function showArtistPage() {
	hideAll();
	$('#page-artist').show();
	showPlayerBar();	
}

function showAlbumPage() {
	hideAll();
	$('#page-album').show();
	showPlayerBar();
}

function showPlayerBar() {
	$('#player-bar').show();
}

function hidePlayerBar() {
	$('#player-bar').hide();	
}

function showSettingsMenu() {
	$('#settingsMenuArea').show();
}

function hideSettingsMenu() {
	$('#settingsMenuArea').hide();
}

function showSongOptions() {
	$('#songOptionsArea').show();
}

function hideSongOptions() {
	$('#songOptionsArea').hide();
}

function showArtistOptions() {
	$('#artistOptionsArea').show();
}

function hideArtistOptions() {
	$('#artistOptionsArea').hide();
}

function showPlaylistSongOptions() {
	$('#playlistSongOptionsArea').show();
}

function hidePlaylistSongOptions() {
	$('#playlistSongOptionsArea').hide();
}

function hideAll() {
	$('#loginArea').hide();
	$('#appSettingsArea').hide();
    $('#page-player').hide();
	$('#page-playlist-current').hide();
	$('#page-artist').hide();
	$('#page-search').hide();
	$('#page-album').hide();
	$('#page-artists-overview').hide();
	$('#page-artists-overview-scrollnav').hide();
	$('#page-playlists-overview').hide();
	hideMpdSelection();
	hideSettingsMenu();
	hideSongOptions();
	hidePlayerBar();
}

function showLoginArea() {
	$('#loginArea').show();	
};

function showLoading() {
	$('#loadingPage').show();
}

function hideLoading() {
	$('#loadingPage').hide();
}

function onDeviceReady(){
    document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("resume", onResume, false);
}

function activateMpdVolumeControl() {
	console.log('MPD volume control should be activated');
	document.addEventListener("volumedownbutton", onVolumeDown, false);
	document.addEventListener("volumeupbutton", onVolumeUp, false);	
}

function deactivateMpdVolumeControl() {
	console.log('MPD volume control should be deactivated');
	document.removeEventListener("volumedownbutton", onVolumeDown);
	document.removeEventListener("volumeupbutton", onVolumeUp);		
}

function onResume() {
	reconnectWebsocket();
}

function onBackKeyDown() {
    navigateBack();
    return false;
}

function onVolumeDown() {
	// alert("volume- button");
	// increaseVolume();
	// setVolume(getVolume()-0.05);
	sendMpdVolumeDecrease();
	showVolumeBar();
}

function onVolumeUp() {
	// alert("volume+ button");
	// reduceVolume();
	// setVolume(getVolume()+0.05);
	sendMpdVolumeIncrease();
	showVolumeBar();
}

function hideVolumeBar() {
	var currentDate = new Date();
	// var diff = currentDate - volumeBarShowDate;
	if (volumeBarShowDate && (currentDate - volumeBarShowDate) < 1000) {
		setTimeout(function() {
			hideVolumeBar();
		},1000);
		return;
	}
	$('#volumeControl').hide();
}

function showVolumeBar() {
	volumeBarShowDate = new Date();
	// volumeBarShowFlag = true;
	$('#volumeControl').show();
	setTimeout(function() {
		hideVolumeBar();
	},1000);
}

function setVolumeBar(value) {
	
}

function setMpdList(mpdList) {
	console.log(mpdList);
	$('#mpdSelection').empty();
	mpdList.unshift({
		id: 0,
		name: 'Stream'
	});

	$('#mpdSelection').data('test','foo');
	
	for(var i in mpdList) {
		var listEntry = $('<div></div>');
		listEntry.append(mpdList[i].name);
		listEntry.data('mpdId',mpdList[i].id);
		if(mpdList[i].connected == false) {
			listEntry.addClass('disabled');
		}

		(function(id){
			listEntry.on("click", function(event) {
				if( $(event.target).hasClass('disabled')) {
					connectToMpdClient(id);
					return;			
				}

				//check MPD Playlist, compare with current playlist
				//ask user to take a) MPD b) Current c) Cancel

				if(id==0) {
					selectOutputDevice(id);
					hideMpdSelection();
					refreshMpdSwitchStatus();
					highlightActiveMpdSelection();
					return;
				}
				showMpdPlaylistSourceOptions(id, event.target);

			});
		})(mpdList[i].id);
		$('#mpdSelection').append(listEntry);
	}

	refreshMpdSwitchStatus();
	highlightActiveMpdSelection();
}

function showMpdPlaylistSourceOptions(id, eventTarget) {
	$("div.settingsMenu > div.submenu").remove();

	var playlistSourceMpd = $('<div></div>');
	playlistSourceMpd.addClass('submenu');
	playlistSourceMpd.addClass('loading');
	playlistSourceMpd.append('MPD playlist');

	playlistSourceMpd.on("click", function(event) {
		changeOutputDevice(id, true);
	});

	var playlistSourcePlayer = $('<div></div>');
	playlistSourcePlayer.addClass('submenu');
	playlistSourcePlayer.append('Player playlist');

	playlistSourcePlayer.on("click", function(event) {
		changeOutputDevice(id, false);
	});

	playlistSourceMpd.insertAfter($(eventTarget));
	playlistSourcePlayer.insertAfter($(eventTarget));
}

function changeOutputDevice(id, init) {
	selectOutputDevice(id, init);
	hideMpdSelection();
	refreshMpdSwitchStatus();
	highlightActiveMpdSelection();
}

function refreshMpdSwitchStatus() {

	if(getSelectedMpd()>0) {
		$('#btnMpd').addClass('active');	
	} else {
		$('#btnMpd').removeClass('active');
	}
}

function highlightActiveMpdSelection() {
	$('#mpdSelection').children('div').each(function() {
		if($(this).data('mpdId') == getSelectedMpd()) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});
}

function showMpdSelection() {
	$('#mpdSelectionArea').show();
}

function hideMpdSelection() {
	$('#mpdSelectionArea').hide();
	$("div.settingsMenu > div.submenu").remove();
}

function activateMpdSwitch() {
	// activateMpd(true);
	refreshMpdSwitchStatus();
}

function frontendUnmute() {
	$('#btnMute').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up');
}

function frontendMute() {
	$('#btnMute').removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off');
}

function showPreferences() {
	$('#serverAddressLocal').val(configHelper.getServerAddressLocal(serverAddressLocal));
	$('#serverPortLocal').val(configHelper.getServerPortLocal(serverPortLocal));
	$('#serverAddressWeb').val(configHelper.getServerAddressWeb(serverAddressWeb));
	$('#serverPortWeb').val(configHelper.getServerPortWeb(serverPortWeb));
	$('#appSettingsArea').show();
}
function frontendActivateShuffle() {
	$('#btnShuffle').removeClass('inactive');
}

function frontendDeactivateShuffle() {
	$('#btnShuffle').addClass('inactive');
}

function activateManualLoginAfterTimeout() {

}

function showConnectionSettings() {
	$('#serverAddressLocal').val(configHelper.getServerAddressLocal());
	$('#serverPortLocal').val(configHelper.getServerPortLocal());
	$('#serverAddressWeb').val(configHelper.getServerAddressWeb());
	$('#serverPortWeb').val(configHelper.getServerPortWeb());
	$('#appSettingsArea').show();
	hideLoading();
}

function hideConnectionSettings() {
	$('#appSettingsArea').hide();
}

function showInfo(infotext) {
	$('#infoOverlayText').text(infotext);
	$('#infoOverlay').show();
}

function changePositionInPlaylistFrontend(originalIndex, finalIndex) {
	var source = $('li:eq('+originalIndex+')');
	var target = $('li:eq('+finalIndex+')');
	source.insertAfter(target);
}

function scrollToAnchor(aid){
    var aTag = $("div[id='listHeadline-"+aid+"']");
    $('#page-artists-overview').animate({scrollTop: $('#page-artists-overview').scrollTop() + aTag.offset().top},'slow');
}

$(document).ready(function(){
	// $('#loadingPage').show();

	document.addEventListener("deviceready", onDeviceReady, false);

	hideVolumeBar();


	$("#playlist").sortable({
	axis: "y",
	handle: ".sort-handler",
	start: function(event, ui) {
	    ui.item.startPos = ui.item.index();
	},
	stop: function(event, ui) {
	    changePositionInPlaylist(ui.item.startPos,ui.item.index());
	},
	out: function( event, ui ) {
	}
	});


	$('#loginSubmit').click(function() {
		if($('#loginUsername').val()==null || $('#loginUsername').val()=="" || $('#loginPassword').val()==null || $('#loginPassword').val()=="") {
			if(configHelper.getUsername() != null && configHelper.getPassword() != null) {
				login(configHelper.getUsername(), configHelper.getPassword());
				return;
			}
			alert('Neither Username and/or password given nor stored for autologin!');
			return;
		}
		var inputUsername = $('#loginUsername').val();
		var inputPassword = CryptoJS.SHA512($('#loginPassword').val()).toString(CryptoJS.enc.Hex);
		login(inputUsername, inputPassword);
	});

	$('#loginSubmitAuto').click(function() {
		if($('#loginUsername').val()==null || $('#loginUsername').val()=="" || $('#loginPassword').val()==null || $('#loginPassword').val()=="") {
			alert('Username and/or password missing!');
			return;
		}
		var inputUsername = $('#loginUsername').val();
		var inputPassword = $('#loginPassword').val();
		configHelper.setUsername(inputUsername);
		configHelper.setPassword(inputPassword);
		login(configHelper.getUsername(), configHelper.getPassword());
	});

	$('#openAppSettings').click(function() {
		showPreferences();
	});

	$('#appSettingsSubmit').click(function() {
		var serverAddressLocal = $('#serverAddressLocal').val();
		var serverPortLocal = $('#serverPortLocal').val();
		var serverAddressWeb = $('#serverAddressWeb').val();
		var serverPortWeb = $('#serverPortWeb').val();
		configHelper.setServerAddressLocal(serverAddressLocal);
		configHelper.setServerPortLocal(serverPortLocal);
		configHelper.setServerAddressWeb(serverAddressWeb);
		configHelper.setServerPortWeb(serverPortWeb);
		hideConnectionSettings();
		showLoginArea();
	});

	$('#appSettingsCancel').click(function() {
		$('#appSettingsArea').hide();
	});

	$('#search').bind('input', function() {
		getAutocompleteSearch($('#search').val());
	});

	$('#player-bar').click(function() {
		showPlayer();
	});

	$('#player-top-menu-search').click(function() {
		showSearch();
	});

	$('#btnPlaylist').click(function() {
		showPlaylist();
		console.log($("#jquery_jplayer_1").data("jPlayer").status);
	});

	$('#btnExplore').click(function() {
		showArtistsPage();
	});

	$('#btnPlaylists').click(function() {
		playlistSelectionFunction = getPlaylist;
		showPlaylistsPage();
	});

	initializePlayer();
	// showPlayer();

	var storedUsername = configHelper.getUsername();
	var storedPassword = configHelper.getPassword();

	if(!configHelper.getServerAddressLocal()) {
		showConnectionSettings();
	} else {
		if(storedUsername && storedPassword) {
			login(storedUsername, storedPassword);
			activateManualLoginAfterTimeout();
		}
	}

	$('#btnPlayPause').click(function() {
		playPause();
	});

	$('#jp_poster_0').on('load', function () {
		$('#player-bar-image').attr('src',$('#jp_poster_0').attr('src'));
	});

	$('#btnMpd').click(function() {
		showMpdSelection();
	});

	$('#btnMute').click(function() {
		if(isVolumeMuted()) {
			console.log('unmute');
			unmute();
			frontendUnmute();
		} else {
			console.log('mute');
			mute();
			frontendMute();
		}		
	});

	$('#btnShuffle').click(function() {
		if(isRandomActive()) {
			console.log('unshuffle');
			deactivateShuffle();
			frontendDeactivateShuffle();
		} else {
			console.log('shuffle');
			activateShuffle();
			frontendActivateShuffle();
		}
	});

	$('#mpdSelectionOverlay').click(function() {
		hideMpdSelection();
	});

	$('#btnSettings').click(function() {
		showSettingsMenu();
	});

	$('#settingsMenuOverlay').click(function() {
		hideSettingsMenu();
	});

	$('#songOptionsOverlay').click(function() {
		hideSongOptions();
	});

	$('#artistOptionsOverlay').click(function() {
		hideArtistOptions();
	});

	$('#showArtistOption').click(function() {
		showArtistOptions();
	});

	$('#likeArtist').click(function() {
		sendUnlikeArtist(artistOptionsData.artistId);
		// it's not liked now anymore, so hide like and active dislike button
		$('#likeArtist').hide();
		$('#dislikeArtist').hide();
		$('#unlikeArtist').show();
		$('#undislikeArtist').show();
		$('div[id=\'artistList_'+artistOptionsData.artist+'\'] > div.artistLike').attr('class', 'artistLike');
	});

	$('#unlikeArtist').click(function() {
		sendLikeArtist(artistOptionsData.artistId);
		// it's liked now, so hide inactive like and active dislike button
		$('#unlikeArtist').hide();
		$('#dislikeArtist').hide();
		$('#likeArtist').show();
		$('#undislikeArtist').show();
		$('div[id=\'artistList_'+artistOptionsData.artist+'\'] > div.artistLike').attr('class', 'glyphicon glyphicon-heart artistLike');
	});

	$('#dislikeArtist').click(function() {
		sendUndislikeArtist(artistOptionsData.artistId);
		$('#likeArtist').hide();
		$('#dislikeArtist').hide();
		$('#unlikeArtist').show();
		$('#undislikeArtist').show();
		$('div[id=\'artistList_'+artistOptionsData.artist+'\'] > div.artistLike').attr('class', 'artistLike');
	});

	$('#undislikeArtist').click(function() {
		sendDislikeArtist(artistOptionsData.artistId);
		$('#likeArtist').hide();
		$('#undislikeArtist').hide();
		$('#dislikeArtist').show();
		$('#unlikeArtist').show();
		$('div[id=\'artistList_'+artistOptionsData.artist+'\'] > div.artistLike').attr('class', 'glyphicon glyphicon-ban-circle artistLike');
	});

	$('#likeAlbum').click(function() {
		sendUnlikeAlbum(albumOptionsData.albumId);
		$('#likeAlbum').hide();
		$('#dislikeAlbum').hide();
		$('#unlikeAlbum').show();
		$('#undislikeAlbum').show();
		$('div[id=\'albumList_'+albumOptionsData.albumId+'\'] > div.albumInfo > div.albumLike').attr('class', 'albumLike');
	});

	$('#unlikeAlbum').click(function() {
		sendLikeAlbum(albumOptionsData.albumId);
		$('#likeAlbum').show();
		$('#dislikeAlbum').hide();
		$('#unlikeAlbum').hide();
		$('#undislikeAlbum').show();
		$('div[id=\'albumList_'+albumOptionsData.albumId+'\'] > div.albumInfo > div.albumLike').attr('class', 'glyphicon glyphicon-heart albumLike');
	});

	$('#dislikeAlbum').click(function() {
		sendUndislikeAlbum(albumOptionsData.albumId);
		$('#likeAlbum').hide();
		$('#dislikeAlbum').hide();
		$('#unlikeAlbum').show();
		$('#undislikeAlbum').show();
		$('div[id=\'albumList_'+albumOptionsData.albumId+'\'] > div.albumInfo > div.albumLike').attr('class', 'albumLike');
	});

	$('#undislikeAlbum').click(function() {
		sendDislikeAlbum(albumOptionsData.albumId);
		$('#likeAlbum').hide();
		$('#dislikeAlbum').show();
		$('#unlikeAlbum').show();
		$('#undislikeAlbum').hide();
		$('div[id=\'albumList_'+albumOptionsData.albumId+'\'] > div.albumInfo > div.albumLike').attr('class', 'glyphicon glyphicon-ban-circle albumLike');
	});

	$('#player-current-song-like').click(function() {
		unlikeCurrentSong();
		$('#player-current-song-like').hide();
		$('#player-current-song-dislike').hide();
		$('#player-current-song-unlike').show();
		$('#player-current-song-undislike').show();
	});

	$('#player-current-song-unlike').click(function() {
		likeCurrentSong();
		$('#player-current-song-like').show();
		$('#player-current-song-unlike').hide();
		$('#player-current-song-dislike').hide();
		$('#player-current-song-undislike').show();
	});
	
	$('#player-current-song-dislike').click(function() {
		$('#player-current-song-like').hide();
		$('#player-current-song-unlike').show();
		$('#player-current-song-dislike').hide();
		$('#player-current-song-undislike').show();
	});
	
	$('#player-current-song-undislike').click(function() {
		$('#player-current-song-like').hide();
		$('#player-current-song-unlike').show();
		$('#player-current-song-dislike').show();
		$('#player-current-song-undislike').hide();
	});

	$('#playlistSongOptionsOverlay').click(function() {
		hidePlaylistSongOptions();
	});

	$('#restartServer').click(function() {
		restartServer();
		location.reload();
	});

	$('#restartApp').click(function() {
		window.location.reload(true);
	});

	$('#loginScreenrestartApp').click(function() {
		window.location.reload(true);
	});

	$('#showPreferences').click(function() {
		showPreferences();
	});

	$('#newPlaylistPlaceholder').click(function() {
		$('#newPlaylistPlaceholder').hide();
		$('#newPlaylist').show();
		$('#newPlaylistInput').val('');
		$('#newPlaylistInput').focus();
	});

	$('#newPlaylistInput').focusout(function() {
		if($('#btnCreatePlaylist:hover').length) {
			return;
		}
		$('#newPlaylist').hide();
		$('#newPlaylistPlaceholder').show();
	});

	$('#btnCreatePlaylist').click(function() {
		savePlaylist(0,$('#newPlaylistInput').val(),null);
	});

	$('#addSongToCurrentPlaylist').click(function() {
		addToPlaylist(songOptionsSongData.id,songOptionsSongData.title,songOptionsSongData.album,songOptionsSongData.artist,null,songOptionsSongData.isFlac, songOptionsSongData.likeCode);
    	modifyPlaylistDesign();
    	hideSongOptions();
	});

	$('#playSongNext').click(function() {
		addToPlaylistAsNext(songOptionsSongData.id,songOptionsSongData.title,songOptionsSongData.album,songOptionsSongData.artist,null,songOptionsSongData.isFlac, songOptionsSongData.likeCode);
    	modifyPlaylistDesign();
    	hideSongOptions();
	});

	$('#removeSongFromCurrentPlaylist').click(function() {
		console.log('should remove');
		removeSongFromCurrentPlaylist(playlistSongOptionsSongData.index);
		hidePlaylistSongOptions();
	});

	$('div.jp-playlist').click( function(e) {
		if($(e.target).attr('class') == 'options') {
			console.log('options direct');
			console.log($('div.options').index($(e.target)));
			playlistSongOptionsSongData.index = $('div.options').index($(e.target));
			showPlaylistSongOptions();
			return;
		}
		if($(e.target).parents('div').attr('class') == 'options') {
			console.log('options span');
			console.log($('div.options').index($(e.target).parents('div')));
			playlistSongOptionsSongData.index = $('div.options').index($(e.target).parents('div'));
			showPlaylistSongOptions();
			return;
		}

    });

	$('#addSongToPlaylist').click(function() {
		playlistSelectionFunction = function(id) {
			console.log('will add song with id:'+songOptionsSongData.id+'to playlist with id:'+id);
			sendAddSongToPlaylist(songOptionsSongData.id, id);
		};
		hideSongOptions();
		showPlaylistsPage();
	});

	$('#playArtist').click(function() {
	    createNewPlaylist();

        for(var albumcount in artistOptionsData.albums) {

        	var album = artistOptionsData.albums[albumcount];
        	for(var songcount in album.songs) {
        		console.log(albumcount, songcount);
        		var song = album.songs[songcount];
            	addToPlaylist(song.id, song.title,album.name,artistOptionsData.artist,song.storagePath,song.isFlac, song.likeCode);

        	}
        }

        modifyPlaylistDesign();
		play();
		hideArtistOptions();
	});


	// divimg.addEventListener("DOMAttrModified", function(event) {
	//     if (event.attrName == "src") {
	//        // The `src` attribute changed!
	//     }
	// });
});

