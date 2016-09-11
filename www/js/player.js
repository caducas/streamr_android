var playlist = [];
var selectedMpd = 0;
var intervalForSongPlayingOnMpd;
var volumeBeforeMute;
var currentVolume = 50;

function initializePlayer() {


	$("#jquery_jplayer_1").jPlayer({
		ready: function () {
		},
		play: function() {
			// console.log('play on player side');
      		frontendPlay();
		},
		seeked: function() {
			// console.log('seeked:' +$("#jquery_jplayer_1").data("jPlayer").status.currentTime);
			doMpdAction(function() {
				// console.log('mpd action');
				// frontendStopMpdSeekBar();
				sendMpdSeek($("#jquery_jplayer_1").data("jPlayer").status.currentTime);
				// startSeekBarAfterSongStartsPlaying();
			});
		},
		cssSelectorAncestor: "#jp_container_1",
		swfPath: "/js",
		supplied: "mp3",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: true,
		size: {
			width: "100%"
			, height: "100%"
		}
	});

	$.jPlayer.prototype.volumeBar = function(e) { // Handles clicks on the volumeBar
		if(this.css.jq.volumeBar.length) {
		  // Using $(e.currentTarget) to enable multiple volume bars
		  var $bar = $(e.currentTarget),
		    offset = $bar.offset(),
		    x = e.pageX - offset.left,
		    w = $bar.width(),
		    y = $bar.height() - e.pageY + offset.top,
		    h = $bar.height();
		  if(this.options.verticalVolume) {
		    this.volume(y/h);
		  } else {
		    this.volume(x/w);
		    sendMpdVolume(Math.round(x/w*100));
		    getMpdStatus();
		    if(Math.round(x/w*100)>0 && isVolumeMuted()) {
		    	frontendUnmute();
		    }
		  }
		}
		if(this.options.muted) {
		  this._muted(false);
		}
	}

	jPlayerPlaylist.prototype._createItemHandlers = function() {
	  var self = this;
	  // Create live handlers for the playlist items
	  $(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.itemClass).on("click", "a." + this.options.playlistOptions.itemClass, function() {
	    var index = $(this).parent().parent().index();
	    console.log(index);
	    if(self.current !== index) {
	      play(index);
	    } else {
	      play();
	    }
	    $(this).blur();
	    return false;
	    console.log('TEST');
	  });

	  if(jPlayerPlaylist.prototype._next == undefined) {
	  	console.log('playlist_next undefined');
	  	jPlayerPlaylist.prototype._next = jPlayerPlaylist.prototype.next;
	  }

	  jPlayerPlaylist.prototype.next = function() {
	  	console.log('next song');
	  	console.log(playlist.playlist);
	  	if(isRandomActive()) {
	  		if(!isRepeatActive) {
		  		var seqArrayNotPlayed = [];
		  		for(var i in playlist.playlist) {
		  			if(playlist.playlist[i].played == undefined || !playlist.playlist[i].played) {
		  				seqArrayNotPlayed.push(i);
		  			}
		  		}
		  		console.log(seqArrayNotPlayed);
		  		if(isRepeatActive)
		  		var rndIndex = parseInt(Math.random()*seqArrayNotPlayed.length);	
	  			var playIndex = parseInt(seqArrayNotPlayed[rndIndex]);
	  			playlist.playlist[playIndex].played = true;
	  		} else {
	  			var playIndex = parseInt(Math.random()*playlist.playlist.length);
	  		}
	  		playlist.select(playIndex);
	  		playlist.play(playIndex);
	  	} else {
	  		if(isRepeatActive && playlist.current == playlist.playlist.length-1) {
	  			playlist.select(0);
	  			playlist.play(0);
	  		} else {
				playlist._next();
	  		}
	  	}
	  }
	  // Create live handlers that disable free media links to force access via right click
	  $(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.freeItemClass).on("click", "a." + this.options.playlistOptions.freeItemClass, function() {
	    $(this).parent().parent().find("." + self.options.playlistOptions.itemClass).click();
	    $(this).blur();
	    return false;
	  });

	  // Create live handlers for the remove controls
	  $(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.removeItemClass).on("click", "a." + this.options.playlistOptions.removeItemClass, function() {
	    var index = $(this).parent().parent().index();
	    self.remove(index);
	    doMpdAction(function() {
	    	sendMpdRemoveSong(index+1);
	    })
	    $(this).blur();
	    return false;
	  });
	}

	playlist = new jPlayerPlaylist({
	  jPlayer: "#jquery_jplayer_1",
	  cssSelectorAncestor: "#jp_container_1"
	}, [
	], {
	  playlistOptions: {
	    enableRemoveControls: true,
	    removeTime: 0
	  },
	  swfPath: "/js",
	  supplied: "mp3",
	  next: function() {
			console.log('just console next');
		}
	});

	// $('#btnPlay').click(function() {
	// 	// audioControlPlay();
	// 	play();
	// });

	$('#btnPause').click(function() {
		pause();
	});

	$('#btnNext').unbind('click');
	$('#btnNext').bind('click', function() {
	    // nextMpd();
	    console.log('next clicked');
	    next();
	});


	$('#btnPrevious').unbind('click');
	$('#btnPrevious').bind('click', function() {
		prev();
	});

	$('#btnVolume').click(function() {
		if(isVolumeMuted()) {
			audioControlUnmute();
			frontendUnmute();
			doMpdAction(function() {
				console.log('volumeBeforeMute:'+volumeBeforeMute);
				$('.jp-volume-bar-value').width(volumeBeforeMute);
				sendMpdVolume($('.jp-volume-bar-value').width());
				getMpdStatus();
			// sendMpdUnmute();
			});
		} else {
			doMpdAction(function() {
				volumeBeforeMute = $('.jp-volume-bar-value').width()/$('.jp-volume-bar').width()*100;
				sendMpdVolume(0);
				getMpdStatus();
				console.log('volumeBeforeMute:'+volumeBeforeMute);
			});
			audioControlMute();
			frontendMute();
		}
	});

  // $('#search').bind('input', function() {
  // 	getAutocompleteSearch()
  // 	// setAutocompleteResult();
  //   // socket.emit("getArtistForSearchTerm", $(this).val());
  // });
	// var cw = $('#player').width();
	// $('#player').css({'height':cw+'px'});
}

function removePlayedFromSongs() {
	for(var i in playlist.playlist) {
		playlist.playlist[i].played = false;
	}
}

function audioControlPause() {
    doActionForSelectedOutputDevice(function() {
      frontendPause();
      pauseStream();
    },
    function() {
      pauseMpd();
    });
}

function audioControlMute() {
	$('#jquery_jplayer_1').jPlayer("mute");
}

function audioControlUnmute() {
	$('#jquery_jplayer_1').jPlayer("unmute");
}


function addToPlaylist(id, title, album, artist, path, flac, init) {

  // var hash = generateHash();
  console.log('adding song to playlist with id:'+id+' title:'+title+' album:'+album+' artist:'+artist+' path:'+path+' flac:'+flac);

  var song = {
    id:id,
    title:title,
    artist:artist,
    album:album,
    // mp3:"/music/" + title + ".mp3",
    // mp3:"",
    // mp3:"http://10.0.0.188:3000/media/01.mp3",
    // mp3:"http://127.0.0.1:3000/media/01.mp3",
    // mp3:"http://192.168.8.80:3000/media/"+path,
    mp3:"http://192.168.8.80:3000/media/"+artist+"/"+album+"/"+title+".mp3",
    // mp3:"/media/"+path,
    // mp3:"/music/" + hash + ".mp3",
    path:path,
    isFlac:flac,
    // poster:"http://127.0.0.1:3000/media/Volbeat/artist.jpg"
    // poster:"http://10.0.0.188:3000/media/Volbeat/artist.jpg"
    poster:"http://192.168.8.80:3000/media/"+artist+"/"+album+"/albumMedium.jpg"
    // poster:"/media/"+artist+"/"+album+"/album.jpg"
  }

  // prepareSongFileForStream(path, hash);

  playlist.add(song);
  // console.log('should add song:');
  // console.log(song);
  // console.log(playlist);

  if(init) {
  	return;
  }
	console.log('will add song to mpd playlist');
	doMpdAction(function() {
		addSongToPlaylistMpd(song);
	});  	
	if(playlist.playlist.length===0) {
		playStream();
		pauseStream();
}


  // addAjaxLoadingBar(path);
  // prepareSongFileForStream(path);
}


function createNewPlaylist() {

  //have to copy old instance for .remove() after initiating new instance
  //otherwise the old playlist will remain and elements not overwritten by new songs can be played without listing in playlist
  var oldPlaylist = playlist;

  playlist = new jPlayerPlaylist({
      jPlayer: "#jquery_jplayer_1",
      cssSelectorAncestor: "#jp_container_1"
    }, [
    ], {
      playlistOptions: {
        enableRemoveControls: true,
        removeTime: 0
      },
      swfPath: "/js",
      supplied: "mp3"
    });
  currentPlaylistId = undefined;
  oldPlaylist.remove();
  doMpdAction(function() {
    setPlaylistMpd();
  });
}


function play(index) {
	// console.log('play function on user side...');
	// console.log(playlist.playlist);
	// playStream();
	// console.log(playlist.playlist);
	if(playlist.playlist.length===0) {
		return;
	}
	// console.log(playlist.playlist);
  	// console.log('should play frontend');
    // frontendPlay();
    // console.log('should play stream');
    // playStream(index);  

  doActionForSelectedOutputDevice(function() {
  	console.log('play stream');
    frontendPlay();
    playStream(index);    
  },function() {
  	console.log('SHOULD play mpd now');
    if(typeof index != 'undefined') {
      playlist.select(index);
      playMpd(index+1);
    } else {
    	playMpd();    	
    }
  });
  // if(playlist.playlist.length===0) {
  //   return;
  // }
  // // doActionForSelectedOutputDevice(function() {
  //   frontendPlay();
  //   playStream(index);
  // // },function() {
  //   // if(index) {
  //   //   playlist.select(index);
  //   //   index = index+1;
  //   // }
  //   // playMpd(index);
  // // });
}


function modifyPlaylistDesign() {
	console.log
	$('span.jp-artist').each(function() {
		$(this).html($(this).html().split("by ").join("<br />"));
		// $(this).html("Test");
	});
	$('li > div > a.jp-playlist-item-remove').each(function() {
		if(!$(this).parent().hasClass("remover")) {
			$(this).parent().addClass("remover");			
		}
	});

	// 	var func = $(this).onclick;
	// 	// console.log($(this).text());
	// 	// console.log($(this).parent().parent().parent().html());
	// 	$(this).wrap("<div class='remover'></div>");
	// 	$(this).click(func); 
	// });
	$('li > div:not(.content) > a.jp-playlist-item').each(function() {
		// console.log($(this).text());
		// console.log($(this).parent().parent().parent().html());
		$(this).wrap("<div class='content'></div>");
		$(this).parent().insertAfter($(this).parent().parent());
		$(this).parent().parent().append('<div class="sort-handler"><span class=\"glyphicon glyphicon-option-vertical\"></span></div>');
	});
	// $('a.jp-playlist-item').each(function() {
	// 	$(this).parent().html("<div class=\"handler\"><span class=\"glyphicon glyphicon-option-vertical sort-handler\"></span></div><div>"+$(this).parent().html()+"</div>");
	// 	// $(this).prepend("<div><span class=\"glyphicon glyphicon-option-vertical sort-handler\"></span></div><div>");
	// });
	// $('a.jp-playlist-item-remove').each(function() {
	// 	$(this).prepend("<div>").append("</div>");
	// });	
}

function activateMpd(init) {
	selectOutputDevice(1, init);
	listenToMpd(1);
}

function deactivateMpd() {
	selectOutputDevice(0);
	unlistenToMpd();
}

function selectOutputDevice(id, init) {
	selectedMpd = id;
	sendServerSelectedOutputDevice(id);
	console.log('OUTPUT DEVICE CHANGED TO '+id);
	if(init) {
		return;
	}
	// console.log('INIT:'+init);
	if(id > 0) {
		//get status and transfer information to mpd
		var currentTime = $('#current-time').text();
		setPlaylistMpd();
		sendMpdCurrentSong(playlist.current);
		console.log('is play button hidden?');
		console.log($('#play').is(":hidden"));
    	if($('#play').is(":hidden")) {
	      playMpd();
	      console.log('set mpd to currenttime');
	      console.log(currentTime);
	      seekMpd(currentTime);
	      return;
    	}
    	// socket.emit('mpdSetCurrentSong', playlist.current);
		console.log('mpd selected');
		return;
	} 
	console.log('webplayer selected');
	if($('#play').is(":hidden")) {
		stopMpd();
		playStream();
	}
}

function setPlaylistMpd() {
  parseMp3PathInPlaylist();
  console.log(playlist.playlist);
  setMpdPlaylist(playlist.playlist);
}

function parseMp3PathInPlaylist() {
  var current = playlist.current;
  console.log('Parse Playlist');
  // console.log('playlist');
  // console.log(playlist.playlist);
  for(var i in playlist.playlist) {
    playlist.select(i);
  }
  playlist.select(current);
}

function doActionForSelectedOutputDevice(streamAction, mpdAction) {
	// console.log(selectedMpd);
  if(selectedMpd>0) {
    mpdAction();
    return;
  }
  streamAction();
}


function playStream(position) {
  if(position !== undefined) {
  	console.log('should select '+position);
    playlist.select(parseInt(position));    
  }
  // console.log('playstream');
  $("#jquery_jplayer_1").jPlayer('play');
}

function playMpd(index) {
	sendMpdPlay(index);
}

function pauseStream() {
	$('#jquery_jplayer_1').jPlayer("pause");	
}

function pauseMpd() {
  console.log('should pause now on MPD');
  sendMpdCommand('mpdPause');
}

function nextMpd() {
  sendMpdCommand('mpdNext');
}

function previousMpd() {
  sendMpdCommand('mpdPrevious');
}

function addSongToPlaylistMpd(song) {
  parseMp3PathInPlaylist();
  console.log('should add song');
  sendMpdAdd(song);
}

function playerStatusUpdate(data) {
	// console.log(data);
	// console.log("data.song:" + data.song + " playlist.current+1:" +(playlist.current));
	if(data.song != (playlist.current)) {
		playlist.select(parseInt(data.song));
	}

	if(data.state === 'play') {
		frontendPlay();
	}
	if(data.state === 'pause') {
		frontendPause();
	}

	currentVolume = parseInt(data.volume)/100;
	$("#jquery_jplayer_1").jPlayer('volume', currentVolume);

	$("#jquery_jplayer_1").data("jPlayer").status.currentTime = data.elapsed;

	doMpdAction(function() {
		// console.log(data.duration+"%");
		$(".jp-seek-bar").width("100%");
		$(".jp-play-bar").width(data.duration+"%");
		// $(".jp-play-bar").width(calcPercentage($("#jquery_jplayer_1").data("jPlayer").status.currentTime,$("#jquery_jplayer_1").data("jPlayer").status.duration)+"%");
	});
}

function getSelectedMpd() {
	return selectedMpd;
}

function emptyPlaylist() {
	playlist.remove();
	doMpdAction(function() {
		sendMpdEmptyPlaylist();
	});
}

function next() {
    doActionForSelectedOutputDevice(function() {
    	playlist.next();
    }, function() {
      if(playlist.current===(playlist.playlist.size-1)) {
        stopMpd();
        stopFrontend();
      }
      nextMpd();
    });
}

function prev() {
    doActionForSelectedOutputDevice(function() {
      playlist.previous();
    }, function() {
      previousMpd();
    });
}

function playPause() {
	if($('#btnPlay').is(":visible")) {
		play();
	} else {
		pause();
	}

}

function pause() {
	audioControlPause();
	frontendPause();
}


function addSongsToPlaylist(songs) {
console.log(songs);
  for(var songcount in songs) {
     addToPlaylist(songs[songcount].id, songs[songcount].title,songs[songcount].album,songs[songcount].artist,songs[songcount].storagePath,songs[songcount].flac);          
  }
  console.log(playlist);
  modifyPlaylistDesign();
}

function calcPercentage(number, base) {
	console.log(number);
	console.log(base);
	var percentage = (number/base*100);
	console.log(percentage);
	return (number/base*100);
}

function initMpd(mpdPlaylist) {
	console.log(playlist.playlist.length);
	if(playlist.playlist.length>0) {
		// alert('PLAYLIST NOT EMPTY!!!');
	} else {
		console.log('should add playlist now');
		console.log(mpdPlaylist);
		for(var songcount in mpdPlaylist) {
			addToPlaylist(mpdPlaylist[songcount].id, mpdPlaylist[songcount].title,mpdPlaylist[songcount].album,mpdPlaylist[songcount].artist,mpdPlaylist[songcount].storagePath,mpdPlaylist[songcount].flac, true);
		}
	}
}

function setVolume(value) {
	// alert('should set volume to '+value);
	if(value>1) {
		value = 1;
	}
	if(value<0) {
		value = 0;
	}
	currentVolume = value;
	sendMpdVolume(currentVolume);
}

function getVolume() {
	return currentVolume;
}

// function shuffle(array) {
// 	// var tempPlaylistSongsArray = [];
// 	var shuffledSongList = playlist.playlist.slice();

// 	var currentIndex = shuffledSongList.length, temporaryValue, randomIndex;

// 	while(0!==currentIndex) {
// 		randomIndex = Math.floor(Math.random()*currentIndex);
// 		currentIndex -= 1;

// 		temporaryValue = shuffledSongList[currentIndex];
// 		shuffledSongList[currentIndex] = shuffledSongList[randomIndex];
// 		shuffledSongList[randomIndex] = temporaryValue;
// 	}
// 	// return array;
// 	console.log(shuffledSongList);


// 	var i = 0;
// 	while(playlist.playlist.length > 1) {
// 		console.log(playlist.playlist);
// 		if(playlist.current !== 0) {
// 			console.log('removing before');
// 			playlist.remove(0);
// 		} else {
// 			console.log('removing after');
// 			playlist.remove(playlist.playlist.length-1);
// 		}
// 	}
// 	console.log(playlist.playlist);

// 	currentPassed = false;
// 	while(shuffledSongList.length > 0) {
// 		console.log(shuffledSongList);
// 		if(shuffledSongList[0].title == playlist.playlist[playlist.current].title) {
// 			shuffledSongList.splice(0,1);
// 			currentPassed = true;
// 			continue;
// 		}
// 		if(!currentPassed) {
// 			playlist.playlist.slice(playlist.playlist.length-2,0,shuffledSongList[0]);
// 		} else {
// 			playlist.playlist.push(shuffledSongList[0]);
// 		}
// 			shuffledSongList.splice(0,1);
// 		// playlist.playlist.push()
// 		// $('#plan').sortable('refresh');
// 		// playlist.add(shuffledSongList[0]);
// 		// if(!currentPassed) {
// 		// }
// 	}
// 	console.log(playlist.playlist);
// 		$('#playlist').sortable('refresh');
// 	// for (var i in playlist.playlist) {
// 	// 	if(playlist.current !== 0 || i>0) {
// 	// 		console.log('remove '+playlist.playlist[0].)
// 	// 		playlist.remove(0);
// 	// 		i--;
// 	// 	}
// 	// }




	// for (var i in array) {}

	//add til current path == current playing path

	//add after

// 	return array;
// }


