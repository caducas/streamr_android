

$(document).ready(function(){
  // checkAppCompatibility();
  // testConnection();
  // connectWebsockets();
	// connectWebsocket();
	initializePlayer();
  if(isNodeWebkit()) {
    loginIfCredentialsAreStored();
  }
	// login();

	// setTimeout(function() {
	// 	// addToPlaylist(01, "Testsong", "Testalbum", "Volbeat", "", "");
	// },3000);

});

function autocompleteSelected(uiItem) {
	console.log(uiItem);
  if(uiItem.category === 'Artists') {
    socket.emit("getArtist", uiItem.value);
  }
  if(uiItem.category === 'Albums') {
    socket.emit("getAlbum", uiItem.value);
  }
  if(uiItem.category === 'Songs') {
    socket.emit("getSong", uiItem.value);
  }
}

function loginSuccess() {
	showStreamr();
  // getNews();
}

function loginFailed() {
  showLoginArea();
  hideLoading();
}

function storeLoginCredentials(username, password) {
	configHelper.setUsername(username);
	configHelper.setPassword(password);
}

function loginIfCredentialsAreStored() {
	var username = configHelper.getUsername();
	var password = configHelper.getPassword();

	login(username, password);
}

function changePositionInPlaylist(originalIndex, finalIndex) {
  console.log(playlist);

  console.log(playlist.current);
  var current = playlist.current;

  console.log('should change song order from '+originalIndex +' to ' + finalIndex);
  var cacheSong = playlist.playlist[originalIndex];

  playlist.playlist.splice(originalIndex,1);

  playlist.playlist.splice(finalIndex,0,cacheSong);

  // if(originalIndex>finalIndex) {

  // }

  // if(playlist.current)

  console.log('originalIndex:'+originalIndex);
  console.log('playlist.current:'+playlist.current);
  console.log('finalIndex:'+finalIndex);

  doMpdAction(function() {
    sendMpdChangeSongOrder(originalIndex, finalIndex);
  });

  if(originalIndex == playlist.current) {
    playlist.current = finalIndex;
    return;
  }

  if(originalIndex < playlist.current && playlist.current <= finalIndex) {
    playlist.current--;
  }

  if(originalIndex > playlist.current && playlist.current >= finalIndex) {
    playlist.current++;
  }
};

function doMpdAction(mpdAction) {
  doActionForSelectedOutputDevice(function() {},mpdAction);
}

function errorOccured(errorMessage) {
  alert(errorMessage);
}

function restartServer() {
  sendRestartServer();
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();

    /* do what you want with the form */

    console.log('should submit manually');

    //$('#manageAlbumsUploadSong').submit();

    // You must return false to prevent the default form behavior
    return false;
}