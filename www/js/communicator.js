var localSocket;
var webSocket;
var socket;
var keepSocketOpen = true;

function useAvailableSocket() {
	// console.log(useLocalSocket());
	if(useLocalSocket()) {
		return localSocket;
	}
	return webSocket;
}

function connectWebsockets() {
	console.log('connect to websockets');
	connectWebsocket();
	// connectWebsocket(webSocket);
}

function reconnectWebsocket() {
	if(!socket.connected) {
		location.reload();
	}
}

function connectWebsocket(options) {

	var url = getUrl();

	if(typeof options != 'undefined' && options.useWebAddress == true) {
		url = getWebUrl();
	}
	// if(connectionLocal) {
	// 	url = getLocalUrl();
	// } else {
	// 	url = getWebUrl();
	// }
	// console.log(url);
	socket = io('ws://'+url, {
		reconnectionAttempts:2,
		reconnectionDelay: 200
	});

	socket.on('reconnect_failed', function() {
		useWebSocket();
		connectWebsocket();
	});

	socket.on('getAutocompleteSearchResult', function(resultList) {
		setAutocompleteResult(resultList);
	});

	socket.on('getArtistResult', function(data) {
		showArtist(data);
	});

	socket.on('getAlbumResult', function(data) {
		showAlbum(data);
	});

	socket.on('connect', function() {
		$('#loadingPage').hide();
		socket.emit('getMpdList');
		getOutputDevice();
		// socket.connectedToStreamrServer = true;
		// if(connectionLocal) {
		// 	localSocket=socket;
		// 	console.log('its local socket, save');
		// } else {
		// 	webSocket=socket;
		// 	console.log('its web socket, save');
		// }
	});

	socket.on('disconnect', function() {
		if(keepSocketOpen) {
			socket.connect();
		}
	});

	socket.on('disconnectFromServer', function(message) {
		keepSocketOpen = false;
		socket.disconnect();
		showInfo(message);
	});

	socket.on('error', function (e) {
		// console.log('System', e ? e : 'A unknown error occurred');
	});


	socket.on('getNewsResultArtists', function(data) {
		// console.log('received artist news');
		getNewsResultArtists(data);
	});

	socket.on('getNewsResultAlbums', function(data) {
		// console.log('received artist news');
	  
	  getNewsResultAlbums(data);
	});

	socket.on('getArtistsResult', function(data) {
		showArtists(data);
	});

	socket.on('getPlaylistsResult', function(data) {
		showPlaylists(data);
	});

	socket.on('getPlaylistResult', function(data) {
		createNewPlaylist();
		addSongsToPlaylist(data.songs);
	});

	socket.on('getMpdListResult', function(data) {
		setMpdList(data);
	});

	socket.on('mpdStatusUpdate', function(data) {
		playerStatusUpdate(data);
	});

	socket.on('getListOfUsersResult', function(data) {
		createListOfUsers(data);
	});

	socket.on('getUserRolesResult', function(data) {
		setUserRolesList(data);
	});

	socket.on('getUserResult', function(data) {
		setUserForModification(data);
	});

	socket.on('getListOfArtistsForSongOrderResult', function(data) {
		setListOfArtistsForSongOrder(data);
	});

	socket.on('getListOfAlbumsForSongOrderResult', function(data) {
		setListOfAlbumsForSongOrder(data);
	});

	socket.on('getSongListForSongOrderResult', function(data) {
		cacheSongListForSongOrder(data);
		setSongListForSongOrder(data);
	});


	socket.on('getListOfArtistsForManageAlbumsResult', function(data) {
		setListOfArtistsForManageAlbums(data);
	});

	socket.on('getListOfAlbumsForManageAlbums', function(data) {
		setListOfAlbumsForManageAlbums(data);
	});

	socket.on('getSettingsListOfMpdsResult', function(data) {
		setSettingsListOfMpds(data);
	});

	socket.on('saveMpdSuccess', function() {
		saveMpdSuccess();
	});

	socket.on('saveMpdFailed', function(message) {
		errorOccured(message);
	});

	socket.on('getMpdEntryResult', function(data) {
		setMpdForModification(data);
		showNewMpdArea();
	});

	socket.on('getMpdEntryPermissionsResult', function(data) {
		cacheSelectedMpd(data);
		setMpdPermissionList(data);
	});

	socket.on('getMpdEntryPermissionsNotAllowedUsernames', function(data) {
		setMpdNotAllowedUserList(data);
	});

	socket.on('addSongToPlaylistSuccess', function() {
		hidePlaylistsPage();
	});

	socket.on('errorMessage', function(errormessage) {
		errorAlert(errormessage);
	});

	socket.on('activeOutputDevice', function(id) {
		console.log('Active Output Device:'+id);
		selectOutputDevice(id, true);
		// setSelectedMpd(id);
		// addSongsToPlaylist(playlist);
	});

	socket.on('initMpd', function(playlist) {
		console.log('should init');
		initMpd(playlist);
	});
	// if(connectionLocal) {
	// 	localSocket=socket;
	// 	console.log('its local socket, save');
	// } else {
	// 	webSocket=socket;
	// 	console.log('its web socket, save');
	// }
}

function getAutocompleteSearch(value) {
	socket.emit("getAutocompleteSearch", value);
}

function getArtist(name) {
	socket.emit("getArtist", name);
}

function getArtistWithId(id) {
	socket.emit("getArtistWithId", id);
}

function getAlbum(albumId) {
    socket.emit('getAlbumWithId', albumId);
}

function getNews() {
	socket.emit("getNews");
}

function getArtists() {
    socket.emit('getArtists');
}

function getPlaylists() {
	socket.emit('getPlaylists');
}

function getPlaylist(id) {
	socket.emit('getPlaylist', id);
}

function getMpdList() {
	socket.emit('getMpdList');
}

function setMpdPlaylist(playlist) {
	socket.emit('mpdSetPlaylist', getSelectedMpd(), playlist);
}

function sendMpdCommand(cmd) {
	socket.emit(cmd);
}

function sendMpdPlay(index) {
	socket.emit('mpdPlay', getSelectedMpd(), index);
}

function sendMpdPause() {
	socket.emit('mpdPause', getSelectedMpd());
}

function sendMpdNext() {
	socket.emit('mpdNext', getSelectedMpd());
}

function sendMpdPrevious() {
	socket.emit('mpdPrevious', getSelectedMpd());
}

function sendMpdAdd(song) {
  socket.emit("mpdAddSong", getSelectedMpd(), song);
}

function sendMpdCurrentSong(currentSong) {
    socket.emit('mpdSetCurrentSong', getSelectedMpd(), currentSong);	
}

function sendMpdChangeSongOrder(from, to) {
	socket.emit("mpdChangeSongPosition", getSelectedMpd(), from, to);
}

function sendMpdSeek(timeInSec) {
	socket.emit("mpdSeek", getSelectedMpd(), timeInSec);
	// socket.emit("mpdPeriodicalStatusTillPlaying");
	// socket.emit("mpdStatus");
}

function getMpdStatus() {
	socket.emit("mpdStatus", getSelectedMpd());	
}

function sendMpdRemoveSong(index) {
	socket.emit("mpdRemoveSong", getSelectedMpd(), index);
}

// function sendMpdVolume(volume) {
// 	socket.emit("mpdVolume", volume*100);
// }

function sendMpdMute() {
	socket.emit("mpdMute", getSelectedMpd());
}

function sendMpdUnmute() {
	socket.emit("mpdUnmute", getSelectedMpd());
}

function sendMpdVolumeIncrease() {
	// alert("should send mpd message volume+");
	socket.emit("mpdVolumeIncrease", getSelectedMpd());
	console.log('should increase');
}

function sendMpdVolumeDecrease() {
	// alert("should send mpd message volume-");
	socket.emit("mpdVolumeDecrease", getSelectedMpd());
	console.log('should decrease');
}

function sendMpdActivateShuffle() {
	socket.emit("mpdActivateShuffle", getSelectedMpd());
}

function sendMpdDeactivateShuffle() {
	socket.emit("mpdDeactivateShuffle", getSelectedMpd());
}

function sendMpdEmptyPlaylist() {
	socket.emit('mpdEmptyPlaylist', getSelectedMpd());
}

function sendServerSelectedOutputDevice(id, init) {
	console.log('send selected output device:'+id);
	socket.emit("outputDeviceSelected", id, init);
}


function listenToMpd(id) {
	socket.emit('listenToMpd', id);
}

function unlistenToMpd() {
	socket.emit('unlistenToMpd');
}

function connectToMpdClient(id) {
	socket.emit('connectToMpdClient', id);
}

function connectToMpdClients() {
	socket.emit('connectToMpdClients');
}

function getMpdList() {
	socket.emit('getMpdList');
}

function getOutputDevice() {
	socket.emit('getOutputDevice');
}

function login(username, password, cb) {
	// alert('should login now');


	$('#loadingPage').show();

	if($('#autoLogin').is(':checked')) {
		storeLoginCredentials(username, password);
	}

	$.ajax({
		type: "POST",
		url: 'http://'+getUrl()+'/login',
		data: {
			username: username, //bob
			password: password //secret
		},
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		timeout: 1000,
		success: function(data) {
			connectWebsockets();
			loginSuccess();
			// console.log('authenticated');
			if(socket.connected == false) {
				console.log('socket.connected false');
				// connectWebsockets();
			} else {
				console.log('get news (login success)');
				getNews();
			}
			// getNews();

		},
		error: function(a,b,c){
			if(useLocalSocket()) {
				console.log('')
				useWebSocket();
				login(username, password);
			} else {
				console.log('login failed');
				console.log(a);
				console.log(b);
				console.log(c);
				loginFailed();
				alert("Login failed!\nServer:"+getUrl());
				// console.log(b);
				// console.log(a);
				// console.log(c);
			}
		}
	});
}

/*settings*/

function getListOfUsers() {
	socket.emit('getListOfUsers');
}

function getUserRoles() {
	socket.emit('getUserRoles');
}

function getUser(id) {
	socket.emit('getUser', id);
}

function sendCreateNewUser(username, password, role) {
	socket.emit('createUser', username, password, role);
}

function sendSaveExistingUser(id, username, role) {
	socket.emit('saveExistingUser', id, username, role);
}

function sendResetPassword(id, password) {
	socket.emit('resetPassword', id, password);
}

function sendDeleteUser(id) {
	socket.emit('deleteUser', id);
}

function sendAddSongToPlaylist(songId, playlistId) {
	socket.emit('addSongToPlaylist', songId, playlistId);
}

function getListOfArtistsForSongOrder() {
	socket.emit('getListOfArtistsForSongOrder');
}

function getListOfAlbumsForSongOrder(id) {
	socket.emit('getListOfAlbumsForSongOrder', id);
}

function getListOfSongsForSongOrder(selectedAlbumId) {
    if(selectedAlbumId>0) {
      socket.emit('getSongListForSongOrder', selectedAlbumId);
    } 
}

function getListOfArtistsForManageAlbums() {
	socket.emit('getListOfArtistsForManageAlbums');
}

function getListOfAlbumsForManageAlbums(id) {
	socket.emit('getListOfAlbumsForManageAlbums', id);
}

function getSettingsListOfMpds() {
	socket.emit('getSettingsListOfMpds');
}

function saveCurrentSongOrder(songlist) {
  socket.emit('saveSongOrder', songlist);
}

function sendSaveMpd(id, name, ip, port) {
  socket.emit('saveMpd', id, name, ip, port);	
}

function getMpdEntry(id) {
	socket.emit('getMpdEntry', id);
}

function sendDeleteMpd(id) {
	socket.emit('deleteMpd', id);
}

function getMpdEntryPermissions(id) {
	socket.emit('getMpdEntryPermissions', id);
}

function sendAllowMpdForUser(mpdId, id) {
	socket.emit('allowMpdForUser', mpdId, id);
}

function sendDenyMpdForUser(mpdId, id) {
	socket.emit('denyMpdForUser', mpdId, id);
}

function savePlaylist(id, name, playlist) {
	socket.emit('savePlaylist', id, name, playlist);
}

function sendRestartServer() {
	socket.emit('restartServer');
}
