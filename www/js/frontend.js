var volumeBarShowDate;

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
	$('#player-current-artist').text($("#jquery_jplayer_1").data("jPlayer").status.media.artist);
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
				console.log('will open album with id '+id);
				// addToPlaylist(id,);
				addToPlaylist(id,title,album,artist,null);
	        	modifyPlaylistDesign();
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
    $('#page-playlist').show();
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
}

function showArtistsPage() {
	console.log('should get artists page');
	getArtists();
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
		artistEntry.className = 'artist';

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

		// var imageElementDiv = document.createElement('div');
		// imageElementDiv.className = 'artistsImage';
		// var imageElement = document.createElement('img');
		// imageElement.src = encodeURI('http://'+getUrl()+'/media/' + data[i].name + '/artist.jpg');
		// imageElement.onerror = function() {
		//   this.onerror=null;
		//   this.src='';
		// }
		// imageElementDiv.appendChild(imageElement);

		// var artistText = document.createElement('span');
		// if(data[i].name.length > 10) {
		//   artistText.appendChild(document.createTextNode(data[i].name.substring(0,10)+'...'));
		// } else {
		//   artistText.appendChild(document.createTextNode(data[i].name));      
		// }
		// imageElementDiv.appendChild(artistText);

		// (function(artist){
		// imageElementDiv.addEventListener("click", function() {
		//   getArtist(artist);
		// }, false);
		// })(data[i].name);

		// $('#artists').append(imageElementDiv);
	}


	$('#artistsView').show();
	$('#btnArtists').addClass('selected');
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

function hideAll() {
	$('#loginArea').hide();
	$('#appSettingsArea').hide();
    $('#page-player').hide();
	$('#page-playlist').hide();
	$('#page-artist').hide();
	$('#page-search').hide();
	$('#page-album').hide();
	$('#page-artists-overview').hide();
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
	$('#mpdSelectionList').empty();
	mpdList.unshift({
		id: 0,
		name: 'Stream'
	});
	
	for(var i in mpdList) {
		console.log(mpdList[i]);
		var listEntry = document.createElement('li');
		listEntry.appendChild(document.createTextNode(mpdList[i].name));
		(function(id){
			listEntry.addEventListener("click", function() {
				selectOutputDevice(id);
				hideMpdSelection();
				refreshMpdSwitchStatus();
			});
		})(mpdList[i].id);
		$('#mpdSelectionList').append(listEntry);
	}

	refreshMpdSwitchStatus();
}

function refreshMpdSwitchStatus() {
	if($('#mpdSelectionList li').length > 1) {
		$('#btnMpd').removeClass('inactive');
		if(getSelectedMpd()>0) {
			$('#btnMpd').addClass('active');
		} else {
			$('#btnMpd').removeClass('active');
		}
	} else {
		$('#btnMpd').addClass('inactive');		
	}

	console.log(getSelectedMpd());

	if(getSelectedMpd()>0) {
		$('#btnMpd').addClass('active');	
	} else {
		$('#btnMpd').removeClass('active');
	}
}

function showMpdSelection() {
	$('#mpdSelection').show();
}

function hideMpdSelection() {
	$('#mpdSelection').hide();
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

	$('#player-current-title').bind("DOMSubtreeModified",function(){
		$('#player-bar-title').text($('#player-current-title').text());
	});

	$('#player-current-artist').bind("DOMSubtreeModified",function(){
		$('#player-bar-artist').text($('#player-current-artist').text());
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

	$('#mpdSelection').click(function() {
		hideMpdSelection();
	});

	// divimg.addEventListener("DOMAttrModified", function(event) {
	//     if (event.attrName == "src") {
	//        // The `src` attribute changed!
	//     }
	// });


});

