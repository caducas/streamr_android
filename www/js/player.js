var playlist = [];
var outputDevice = 0;
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
	    var index = $(this).parent().parent().parent().index();
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

	  if(typeof jPlayerPlaylist.prototype._next == 'undefined') {
	  	console.log('playlist_next undefined');
	  	jPlayerPlaylist.prototype._next = jPlayerPlaylist.prototype.next;
	  }

	  jPlayerPlaylist.prototype.next = function() {
	  	console.log('next song');
        var playlist = this;
	  	console.log(playlist.playlist);
	  	if(isRandomActive()) {
	  		if(!isRepeatActive()) {
		  		var seqArrayNotPlayed = [];
		  		for(var i in playlist.playlist) {
		  			if(playlist.playlist[i].played == undefined || !playlist.playlist[i].played) {
		  				seqArrayNotPlayed.push(i);
		  			}
		  		}
		  		console.log(seqArrayNotPlayed);
		  		var rndIndex = parseInt(Math.random()*seqArrayNotPlayed.length);	
	  			var playIndex = parseInt(seqArrayNotPlayed[rndIndex]);
	  			playlist.playlist[playIndex].played = true;
	  		} else {
	  			var playIndex = parseInt(Math.random()*playlist.playlist.length);
	  		}
	  		playlist.select(playIndex);
	  		playlist.play(playIndex);
	  	} else {
            console.log('random inactive');
            if(playlist.current < playlist.playlist.length-1) {
                playlist._next();                
            } else {
                if(isRepeatActive()) {
                    playlist.select(0);
                    playlist.play(0);                    
                } else {
                    frontendPause();
                }
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

	// $('#btnPause').click(function() {
	// 	pause();
	// });

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

/*
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
*/

  // $('#search').bind('input', function() {
  // 	getAutocompleteSearch()
  // 	// setAutocompleteResult();
  //   // socket.emit("getArtistForSearchTerm", $(this).val());
  // });
	// var cw = $('#player').width();
	// $('#player').css({'height':cw+'px'});
}

function removeSongFromCurrentPlaylist(index) {
    playlist.remove(index);
    doMpdAction(function() {
        sendMpdRemoveSong(index+1);
    });
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

function addToPlaylistAsNext(id, title, album, artist, path, isFlac, likeCode) {
    addToPlaylist(id, title, album, artist, path, isFlac, likeCode, playlist.current);
}

function addToPlaylist(id, title, album, artist, path, isFlac, likeCode, position, init) {

    // var hash = generateHash();
    console.log('adding song to playlist with id:'+id+' title:'+title+' album:'+album+' artist:'+artist+' path:'+path+' isFlac:'+isFlac+' likeCode:'+likeCode);

    var url = "http://"+getUrl();

    var song = {
        id:id,
        title:title,
        artist:artist,
        album:album,
        mp3:url+"/media/"+artist+"/"+album+"/"+title+".mp3",
        path:path,
        isFlac:isFlac,
        poster:url+"/media/"+artist+"/"+album+"/albumBig.jpg",
        likeCode:likeCode
    }

    playlist.add(song);

    if(init) {
        modifyPlaylistDesign();
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

    if(typeof position !== 'undefined') {

        changePositionInPlaylist(playlist.playlist.length-1,position+1);
        changePositionInPlaylistFrontend(playlist.playlist.length-1,position);
    }
    modifyPlaylistDesign();
}


function createNewPlaylist(playlistId) {

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

    playlist.playlistId = playlistId;
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
      playMpd(parseInt(index)+1); 
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
    // return;
    //remove delete button
    $("a.jp-playlist-item-remove").remove();

    $('li > div').each(function(index) {
        if(!$(this).children('a').length) {
            return;
        }
        var obj = $(this).find('a');
        obj.find('span').text(function(index,oldText){
           //idx is the index of the current element in the JQUERY_OBJECT - not used, but must be given
           return oldText.replace(/^by\s/,'');
        });
        // $(this).unwrap();
        obj.wrap("<div class='content'></div>");
        obj.parent().parent().addClass("playlist-row");

        var poster = playlist.playlist[index].poster;
        poster =  poster.replace("/albumBig.jpg","/albumSmall.jpg");
        poster = poster.replace(/(['])/g,'&apos;');
        $("<div class='sort-handler'><img src='"+poster+"' /></div>").insertBefore(obj.parent());

        $("<div class='options'><span class=\"glyphicon glyphicon-option-vertical\"></span></div>").insertAfter(obj.parent());
    });



    return;
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
	$('li > div:not(.content) > a.jp-playlist-item').each(function(index) {
		// console.log($(this).text());
		// console.log($(this).parent().parent().parent().html());
		$(this).wrap("<div class='content'></div>");
        // $("<img src='"+poster+"'>").wrap($('<a>',{
        //    // href: '/Content/pdf/' + data.pdf1
        // }));
        var poster = playlist.playlist[index].poster;
        // var poster = 'http://192.168.8.70:3000/media/Adele/21/albumSmall.jpg';
        // poster = poster.toString();
        // console.log(poster);
        poster =  poster.replace("/albumBig.jpg","/albumSmall.jpg");
        // poster = poster.replace("albumBig.jpg","albumSmall.jpg");

        console.log(poster);
        // $("<div class='test-album-image'><img src='"+poster+"'></div>").insertBefore($(this).parent());
		$(this).parent().insertAfter($(this).parent().parent());
		$(this).parent().parent().append('<div class="sort-handler"><span class=\"glyphicon glyphicon-option-vertical\"></span></div>');
	});

	$('li').not(':has(div.playlist-row)').wrapInner("<div class='playlist-row'></div>");
	// $('li > div.remover').each(function() {
	// 	("<div>").insertBefore($(this));
	// 	// .insertBefore("<div>");
	// });

	// $('li > div.sort-handler').each(function() {
	// 	// $(this).insertAfter("</div>");
	// });
	// $('a.jp-playlist-item').each(function() {
	// 	$(this).parent().html("<div class=\"handler\"><span class=\"glyphicon glyphicon-option-vertical sort-handler\"></span></div><div>"+$(this).parent().html()+"</div>");
	// 	// $(this).prepend("<div><span class=\"glyphicon glyphicon-option-vertical sort-handler\"></span></div><div>");
	// });
	// $('a.jp-playlist-item-remove').each(function() {
	// 	$(this).prepend("<div>").append("</div>");
	// });	
}

function activateMpd(id, init) {
	selectOutputDevice(id, init);
	listenToMpd(id);
}

function deactivateMpd() {
	selectOutputDevice(0);
	unlistenToMpd();
}

function selectOutputDevice(id, init) {
    // current time is retrieved, will be reset to 0 due to any functionality in this function...
    var currentTime = $("#jquery_jplayer_1").data("jPlayer").status.currentTime;
    var oldOutputDevice = outputDevice;
    if($('#btnPlay').is(":hidden") && id == 0) {
        sendMpdPause();
        playStream(undefined, $("#jquery_jplayer_1").data("jPlayer").status.currentTime);
    }
	outputDevice = id;
	console.log('OUTPUT DEVICE CHANGED TO '+id);
    if(id>0)
    {
        activateMpdVolumeControl();        
    } else {
        deactivateMpdVolumeControl();        
    }
    refreshMpdSwitchStatus();
    highlightActiveMpdSelection();

    sendServerSelectedOutputDevice(id, init);

	if(init) {
		return;
	}

	// console.log('INIT:'+init);
	if(id > 0) {
		//get status and transfer information to mpd
		setPlaylistMpd();
		sendMpdCurrentSong(playlist.current);
        if(isRandomActive()) {
            console.log('should send mpd shuffle active');
            sendMpdActivateShuffle();
        } else {
            console.log('should send mpd shuffle deactive');
            sendMpdDeactivateShuffle();
        }
    	if($('#btnPlay').is(":hidden")) {
	      playMpd();
	      console.log('set mpd to currenttime');
          sendMpdSeek(currentTime);
	      return;
    	}
    	// socket.emit('mpdSetCurrentSong', playlist.current);
		console.log('mpd selected');
		return;
	} 
	console.log('webplayer selected');
}

function setPlaylistMpd() {
  parseMp3PathInPlaylist();
  console.log(playlist.playlist);
  setMpdPlaylist(playlist.playlist);
  if(playlist.playlistId == -1) {
    activateMpdRandomNextSongGeneration();
  } else {
    deactivateMpdRandomNextSongGeneration();    
  }
}

function parseMp3PathInPlaylist() {
  var current = playlist.current;
  console.log('Parse Playlist');
  for(var i in playlist.playlist) {
    playlist.select(i);
  }
  playlist.select(current);
}

function doActionForSelectedOutputDevice(streamAction, mpdAction) {
	// console.log(outputDevice);
  if(outputDevice>0) {
    mpdAction();
    return;
  }
  streamAction();
}


function playStream(position, time) {
  if(position !== undefined) {
  	console.log('should select '+position);
    playlist.select(parseInt(position));    
  }
  // console.log('playstream');
  if(typeof time !== 'undefined') {
    var t = parseInt(time);
    $("#jquery_jplayer_1").jPlayer('play', t);
    return;
  }
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
  // sendMpdCommand('mpdPause');
  sendMpdPause();
}

function nextMpd() {
  // sendMpdCommand('mpdNext');
  sendMpdNext();
}

function previousMpd() {
  // sendMpdCommand('mpdPrevious');
  sendMpdPrevious();
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

	// console.log('VOLUME:');
	// console.log(data.volume);
	$("#volumeControlCurrent").width(data.volume+"%");
	currentVolume = parseInt(data.volume)/100;
	$("#jquery_jplayer_1").jPlayer('volume', currentVolume);

	$("#jquery_jplayer_1").data("jPlayer").status.currentTime = data.elapsed;

    // console.log(data);
	doMpdAction(function() {
		// console.log(data.duration+"%");
		$(".jp-seek-bar").width("100%");
		$(".jp-play-bar").width(data.duration+"%");
		// $(".jp-play-bar").width(calcPercentage($("#jquery_jplayer_1").data("jPlayer").status.currentTime,$("#jquery_jplayer_1").data("jPlayer").status.duration)+"%");
	});
    
    try {
        if(playlist.playlist[playlist.current].likeCode == 1) {
            $("#player-current-song-like").show();
            $("#player-current-song-unlike").hide();
        $("#player-current-song-dislike").hide();
        $("#player-current-song-undislike").show();
    } else {
        if(playlist.playlist[playlist.current].likeCode == -1) {
            $("#player-current-song-like").hide();
            $("#player-current-song-unlike").show();
            $("#player-current-song-dislike").show();
            $("#player-current-song-undislike").hide();
        } else {
            $("#player-current-song-like").hide();
            $("#player-current-song-unlike").show();
                $("#player-current-song-dislike").hide();
                $("#player-current-song-undislike").show();
            }
        }
    } catch(e) {

    }
}

function getSelectedMpd() {
	return outputDevice;
}

function setSelectedMpd(mpdId) {
    outputDevice = mpdId;
    if(id>0) {
        activateMpdSwitch();
    } else {
        deactivateMpdSwitch();
    }
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
    	console.log('next');
    }, function() {
      if(playlist.current===(playlist.playlist.size-1)) {
        stopMpd();
        stopFrontend();
      }
      nextMpd();
      console.log('nextMpd');
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
     addToPlaylist(songs[songcount].id, songs[songcount].title,songs[songcount].album,songs[songcount].artist,songs[songcount].storagePath,songs[songcount].isFlac, songs[songcount].likeCode);
  }
  console.log(playlist);
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
			addToPlaylist(mpdPlaylist[songcount].id, mpdPlaylist[songcount].title,mpdPlaylist[songcount].album,mpdPlaylist[songcount].artist,mpdPlaylist[songcount].storagePath,mpdPlaylist[songcount].isFlac, mpdPlaylist[songcount].likeCode, null, true);
		}
	}
}

// function setVolume(value) {
// 	// alert('should set volume to '+value);
// 	if(value>1) {
// 		value = 1;
// 	}
// 	if(value<0) {
// 		value = 0;
// 	}
// 	currentVolume = value;
// 	sendMpdVolume(currentVolume);
// 	$("#currentVolume").text(currentVolume);
// }

function getVolume() {
	return currentVolume;
}

// this function should be removed, is not needed
// either turn down the volume or press pause
// mute/unmute functionality is very complex in combination with mpd
function mute() {
    doActionForSelectedOutputDevice(function() {
      $("#jquery_jplayer_1").jPlayer('mute');
    }, function() {
    });
}

// this function should be removed, is not needed
// either turn down the volume or press pause
// mute/unmute functionality is very complex in combination with mpd
function unmute() {
    doActionForSelectedOutputDevice(function() {
      $("#jquery_jplayer_1").jPlayer('unmute');
    }, function() {
    });    
}

function activateShuffle() {
    doActionForSelectedOutputDevice(function() {
    }, function() {
      sendMpdActivateShuffle();
    });    
}

function deactivateShuffle() {
    doActionForSelectedOutputDevice(function() {
    }, function() {
      sendMpdDeactivateShuffle();
    });    
}

function likeCurrentSong() {
    console.log(playlist.current);
    console.log(playlist.playlist[playlist.current]);
    playlist.playlist[playlist.current].likeCode = 1;
    sendLikeSong(playlist.playlist[playlist.current].id);
}

function unlikeCurrentSong() {
    console.log(playlist.current);
    console.log(playlist.playlist[playlist.current]);
    playlist.playlist[playlist.current].likeCode = 0;
    sendUnlikeSong(playlist.playlist[playlist.current].id);
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


