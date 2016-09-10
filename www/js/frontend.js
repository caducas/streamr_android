function showPlayer() {
	$('#loginArea').hide();
	$('#streamr').show();
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
	// console.log('aktualisiere status');
	// console.log($("#jquery_jplayer_1").data("jPlayer").status.media.title);
	// console.log($("#jquery_jplayer_1").data("jPlayer").status.media.artist);
	$('#player-bar-title').text($("#jquery_jplayer_1").data("jPlayer").status.media.title);
	$('#player-bar-artist').text($("#jquery_jplayer_1").data("jPlayer").status.media.artist);
	// console.log($("#player-bar-title"));
	// console.log($("#jquery_jplayer_1").data("jPlayer").status.media);
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

function showArtist(data) {
	console.log('show artist page');
	$('#albumList').empty();
	document.getElementById("artist-page-artist-name").html = data.artist;
	console.log('title done');
	console.log(data);
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

function onResume() {
	
	alert('should reconnect!');
}

function onBackKeyDown(){
    alert('back');
    return false;
}

function activateMpdSwitch() {
	$('#btnMpd').addClass('active');
	activateMpd(true);
}


$(document).ready(function(){

	document.addEventListener("deviceready", onDeviceReady, false);



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
		var inputUsername = $('#loginUsername').val();
		var inputPassword = CryptoJS.SHA512($('#loginPassword').val()).toString(CryptoJS.enc.Hex);
		login(inputUsername, inputPassword);
	});

	$('#loginSubmitAuto').click(function() {
		var inputUsername = $('#loginUsername').val();
		var inputPassword = CryptoJS.SHA512($('#loginPassword').val()).toString(CryptoJS.enc.Hex);
		localStorage.setItem("username", inputUsername);
		localStorage.setItem("pw", inputPassword);
		login(inputUsername, inputPassword);
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


	var storedUsername = localStorage.getItem("username");
	var storedPassword = localStorage.getItem("pw");

	if(storedUsername && storedPassword) {
		login(storedUsername, storedPassword);
	}

	$('#btnPlay').click(function() {
		// audioControlPlay();
 //    createNewPlaylist();
		play();
		// showPlaylist();
		// modifyPlaylistDesign();
	});

	$('#jp_poster_0').bind('DOMAttrModified', function(ev) {
		// console.log('dom changed');
		// console.log(ev);
		// console.log(ev.originalEvent.attrName);
		if(ev.originalEvent.attrName == "src") {
			// console.log('should change img to');
			// console.log(ev.originalEvent);
			// console.log(ev.originalEvent.newValue);
			$('#player-bar-image').attr('src',ev.originalEvent.newValue);
			// console.log(playlist);
		}
		// getAutocompleteSearch($('#search').val());
	});

	$('#btnMpd').click(function() {
		console.log('### MPD BUTTON clicked!');
		if($('#btnMpd').hasClass('active')) {
			console.log('active');
			$('#btnMpd').removeClass('active');
			deactivateMpd();
		} else {
			console.log('not active');
			$('#btnMpd').addClass('active');
			activateMpd();
		};
	});

	// divimg.addEventListener("DOMAttrModified", function(event) {
	//     if (event.attrName == "src") {
	//        // The `src` attribute changed!
	//     }
	// });
});
