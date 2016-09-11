var localSocket;
var webSocket;
var socket;

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
		alert('disconnected - should login now');
		location.reload();
	}
}

function connectWebsocket() {
	var url = getUrl();
	// if(connectionLocal) {
	// 	url = getLocalUrl();
	// } else {
	// 	url = getWebUrl();
	// }
	// console.log(url);
	socket = io('ws://'+url);
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
		socket.connect();
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

	socket.on('errorMessage', function(errormessage) {
		errorAlert(errormessage);
	});

	socket.on('mpdActive', function() {
		console.log('########### MPD ACTIVE!!!');
		// addSongsToPlaylist(playlist);
		activateMpdSwitch();
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
	socket.emit('mpdSetPlaylist', playlist);
}

function sendMpdCommand(cmd) {
	socket.emit(cmd);
}

function sendMpdPlay(index) {
	socket.emit('mpdPlay', index);
}

function sendMpdAdd(song) {
  socket.emit("mpdAddSong", song);
}

function sendMpdCurrentSong(currentSong) {
    socket.emit('mpdSetCurrentSong', currentSong);	
}

function sendMpdChangeSongOrder(from, to) {
	socket.emit("mpdChangeSongPosition", from, to);
}

function sendMpdSeek(timeInSec) {
	socket.emit("mpdSeek", timeInSec);
	// socket.emit("mpdPeriodicalStatusTillPlaying");
	// socket.emit("mpdStatus");
}

function getMpdStatus() {
	socket.emit("mpdStatus");	
}

function sendMpdRemoveSong(index) {
	socket.emit("mpdRemoveSong", index);
}

function sendMpdVolume(volume) {
	socket.emit("mpdVolume", volume*100);
}

function sendMpdEmptyPlaylist() {
	socket.emit('mpdEmptyPlaylist');
}

function sendServerSelectedOutputDevice(id) {
	console.log('send selected output device:'+id);
	socket.emit("outputDeviceSelected", id);
}


function listenToMpd(id) {
	socket.emit('listenToMpd', id);
}

function unlistenToMpd() {
	socket.emit('unlistenToMpd');
}

function login(username, password, cb) {
	// alert('should login now');

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
			// console.log(b);
			// console.log(a);
			// console.log(c);
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
