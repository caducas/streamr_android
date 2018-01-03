var volumeBarShowDate;
var songOptionsSongData = {
	id:undefined,
	title:undefined,
	artist:undefined,
	album:undefined
};
var playlistSelectionFunction;

function showStreamr() {
	hideAll();
	$('#streamr').show();
	$('#loadingPage').hide();
	showPlayer();
}

function setAutocompleteResult(resultList) {
	console.log(resultList);
	// console.log($("search-result-area"));
	$("#search-result-area").empty();

	var divArtists = document.createElement('div');
	var divAlbums = document.createElement('div');
	var divSongs = document.createElement('div');

	divArtists.appendChild(document.createTextNode("Artists"));
	divAlbums.appendChild(document.createTextNode("Albums"));
	divSongs.appendChild(document.createTextNode("Songs"));

	for(var i in resultList) {
		console.log(resultList[i]);
		var divEntry = document.createElement('div');
		var divEntryImage = document.createElement('img');
		var imagePath="http://"+getUrl()+"/media/"+resultList[i].imagepath+"/";
		if(resultList[i].category=="Artists") {
			divEntryImage.src = imagePath+"artistSmall.jpg"
		} else {
			divEntryImage.src = imagePath+"albumSmall.jpg"			
		}

		divEntry.appendChild(divEntryImage);
		(function(category, id){
			divEntry.addEventListener("click", function() {
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
		divEntry.appendChild(document.createTextNode(resultList[i].label));
		if(resultList[i].category=="Artists") divArtists.appendChild(divEntry);
		if(resultList[i].category=="Albums") divAlbums.appendChild(divEntry);
		if(resultList[i].category=="Songs") divSongs.appendChild(divEntry);

	}

	console.log(divArtists);
	$("#search-result-area").append(divArtists);
	$("#search-result-area").append(divAlbums);
	$("#search-result-area").append(divSongs);
	// console.log($("search-result-area"));

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
	return false;
	// return $('#btnRandom').hasClass('btnAudioControlOptionsActive'); // TODO
}

function isRepeatActive() {
	return false;
	// return $('#btnRepeat').hasClass('btnAudioControlOptionsActive'); // TODO
}

function isVolumeMuted() {
	return $('#btnMute').hasClass("glyphicon-volume-off");
}

function showArtist(data) {
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

	for(var i in data.albums) {
		console.log(data.albums[i]);

		var album = data.albums[i];

		var divAlbumRow = document.createElement('div');
		divAlbumRow.className='row';

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
	    albumImage.src ="http://"+getUrl()+"/media/"+data.artist+"/"+data.albums[i].name+"/albumMedium.jpg";
	    divAlbumImage.appendChild(albumImage);

	    divAlbumRow.appendChild(divAlbumImage);

	    var divAlbumInfo = document.createElement('div');
	    divAlbumInfo.className = 'albumInfo';

	    var divAlbumTitle = document.createElement('div');
	    divAlbumTitle.className = 'albumTitle';
	    divAlbumTitle.innerHTML = data.albums[i].name;
	    divAlbumInfo.appendChild(divAlbumTitle);

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

	//TODO Background album image

	document.getElementById("page-album-title").innerHTML = data.albumName;
	document.getElementById("page-album-artist").innerHTML = data.artistName;
	document.getElementById("page-album-songcount").innerHTML = data.songs.length + " Songs";
	$('#page-album-playlist').empty();

	for(var i in data.songs) {
		console.log(data.songs[i]);

		var divSongRow = document.createElement('div');
		// divSongRow.className =

		//TODO Listener

		var divSongTitle = document.createElement('div');
		divSongTitle.innerHTML = data.songs[i].title;
		divSongTitle.className = "page-album-song-title";

	    (function(songs, albumName, artistName, playPosition){
	      divSongTitle.addEventListener("click", function() {
	        createNewPlaylist();
	        console.log('should add album');
	        console.log(songs);

	        for(var songcount in songs) {
	            addToPlaylist(songs[songcount].id, songs[songcount].title,albumName,artistName,songs[songcount].storagePath,songs[songcount].flac);
	        }
	        modifyPlaylistDesign();
	        play(playPosition);
	      }, false);
	    })(data.songs, data.albumName, data.artistName, i);
	    console.log('should add song to playlist view with index:'+i+' song:');
	    console.log(data.songs[i]);

		divSongRow.appendChild(divSongTitle);

		var divAddSongToPlaylist = document.createElement('div');
		divAddSongToPlaylist.className = "page-album-song-add";
		// divAddSongToPlaylist.appendChild(document.createElement('span'))
		divAddSongToPlaylist.innerHTML = '<span class="glyphicon glyphicon-plus"></span>';

		(function(id, title, album, artist){
			divAddSongToPlaylist.addEventListener("click", function() {
	        	songOptionsSongData.id = id;
	        	songOptionsSongData.title = title;
	        	songOptionsSongData.album = album;
	        	songOptionsSongData.artist = artist;
	        	showSongOptions();

			});
		})(data.songs[i].id,data.songs[i].title,data.albumName,data.artistName);

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
}

function showArtists(data) {
	hideAll();
	showPlayerBar();
	$('#page-artists-overview').show();

	$('#page-artists-overview').empty();

	var prevArtistLetter = "";

	console.log('data:');
	console.log(data);
	for(var i in data) {
		var artistLetter = data[i].name.charAt(0).toUpperCase();
		if(artistLetter != prevArtistLetter) {
			prevArtistLetter = artistLetter;
			var letterHeadline = document.createElement('div');
			letterHeadline.className = 'listHeadline';
			letterHeadline.appendChild(document.createTextNode(prevArtistLetter));
			$('#page-artists-overview').append(letterHeadline);
		}

		var artistEntry = document.createElement('div');
		artistEntry.className = 'list-element artist';

		var imageElement = document.createElement('img');
		imageElement.src = encodeURI('http://'+getUrl()+'/media/' + data[i].name + '/artistSmall.jpg');
		imageElement.onerror = function() {
		  this.onerror=null;
		  this.src='';
		}
		artistEntry.appendChild(imageElement);

		var artistName = document.createElement('div');
		artistName.appendChild(document.createTextNode(data[i].name));
		artistEntry.appendChild(artistName);


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
		hideAll();
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

function hideAll() {
	$('#loginArea').hide();
	$('#appSettingsArea').hide();
    $('#page-player').hide();
	$('#page-playlist-current').hide();
	$('#page-artist').hide();
	$('#page-search').hide();
	$('#page-album').hide();
	$('#page-artists-overview').hide();
	$('#page-playlists-overview').hide();
	hideMpdSelection();
	hideSettingsMenu();
	hideSongOptions();
	hidePlayerBar();
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

		(function(id){
			listEntry.on("click", function() {
				selectOutputDevice(id);
				hideMpdSelection();
				refreshMpdSwitchStatus();
				highlightActiveMpdSelection();
			});
		})(mpdList[i].id);
		$('#mpdSelection').append(listEntry);
	}

	refreshMpdSwitchStatus();
	highlightActiveMpdSelection();
}

function refreshMpdSwitchStatus() {
	if($('#mpdSelection div').length > 1) {
		$('#btnMpd').removeClass('inactive');
		if(getSelectedMpd()>0) {
			$('#btnMpd').addClass('active');
		} else {
			$('#btnMpd').removeClass('active');
		}
	} else {
		$('#btnMpd').addClass('inactive');		
	}

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
}

function activateMpdSwitch() {
	activateMpd(true);
	refreshMpdSwitchStatus();
}

function frontendUnmute() {
	$('#btnMute').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up');
}

function frontendMute() {
	$('#btnMute').removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off');
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
    	$('#serverAddressLocal').val(configHelper.getServerAddressLocal(serverAddressLocal));
    	$('#serverPortLocal').val(configHelper.getServerPortLocal(serverPortLocal));
    	$('#serverAddressWeb').val(configHelper.getServerAddressWeb(serverAddressWeb));
    	$('#serverPortWeb').val(configHelper.getServerPortWeb(serverPortWeb));
    	$('#appSettingsArea').show();
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

	if(typeof configHelper.getServerAddressLocal() == "undefined"
		|| typeof configHelper.getServerPortLocal() == "undefined") {
		$('#loadingPage').hide();
		$('#appSettingsArea').show();
	} else {
		if(storedUsername && storedPassword) {
			login(storedUsername, storedPassword);
		}
	}

	$('#btnPlayPause').click(function() {
		playPause();
	});

	$('#jp_poster_0').on('load', function () {
		$('#player-bar-image').attr('src',$('#jp_poster_0').attr('src'));
	});

	$('#btnMpd').click(function() {
		console.log('should connect MPD clients');
		connectToMpdClients();

		if(!$('#btnMpd').hasClass('inactive')) {
			showMpdSelection();
		}
		/*
		if($('#btnMpd').hasClass('active')) {
			console.log('active');
			$('#btnMpd').removeClass('active');
			deactivateMpd();
		} else {
			console.log('not active');
			$('#btnMpd').addClass('active');
			activateMpd();
		};*/
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

	$('#restartServer').click(function() {
		restartServer();
		location.reload();
	});

	$('#restartApp').click(function() {
		location.reload();
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
		addToPlaylist(songOptionsSongData.id,songOptionsSongData.title,songOptionsSongData.album,songOptionsSongData.artist,null);
    	modifyPlaylistDesign();
    	hideSongOptions();
	});

	$('#playSongNext').click(function() {
		addToPlaylistAsNext(songOptionsSongData.id,songOptionsSongData.title,songOptionsSongData.album,songOptionsSongData.artist,null);
    	modifyPlaylistDesign();
    	hideSongOptions();
	});

	$('#addSongToPlaylist').click(function() {
		playlistSelectionFunction = function(id) {
			console.log('will add song with id:'+songOptionsSongData.id+'to playlist with id:'+id);
			sendAddSongToPlaylist(songOptionsSongData.id, id);
		};
		hideSongOptions();
		showPlaylistsPage();
	});

	// divimg.addEventListener("DOMAttrModified", function(event) {
	//     if (event.attrName == "src") {
	//        // The `src` attribute changed!
	//     }
	// });
});

