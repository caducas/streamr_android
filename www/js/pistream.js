var server = 'http://10.0.0.188:8888';
var socket = io('http://10.0.0.188:8888');

var playlist = [];
var currentPlaylistId;
var hashCounter = 0;
var currentOutputDeviceId = 0;

login();

$.ui.autocomplete.prototype._renderItem = function( ul, item) {
  var re = new RegExp(this.term, 'i') ;
  var t = item.label.replace(re,"<span style='font-weight:bold;'>$&</span>");

  if(item.category === 'Songs') {
    return $( "<li></li>" )
        .data( "item.autocomplete", item )
        .append( "<a class='autocomplete_artist'><span class='glyphicon glyphicon-music autocomplete_image'></span>" + t + "</a>" )
        .appendTo( ul );
  }
  if(item.category === 'Artists') {
    return $( "<li></li>" )
        .data( "item.autocomplete", item )
        .append( "<a class='autocomplete_artist'><span class='glyphicon glyphicon-user autocomplete_image'></span>" + t + "</a>" )
        .appendTo( ul );
  }
  return $( "<li></li>" )
      .data( "item.autocomplete", item )
      .append( "<a class='autocomplete_artist'><span class='glyphicon glyphicon-record autocomplete_image'></span>" + t + "</a>" )
      .appendTo( ul );
};

$.ui.autocomplete.prototype._renderMenu = function( ul, items ) {
  var that = this,
    currentCategory = "";
  $.each( items, function( index, item ) {
    if ( item.category != currentCategory ) {
      ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
      currentCategory = item.category;
    }
    that._renderItemData( ul, item );
  });
}

socket.on('getUserRole', function(role) {
  if(role === 'admin') {
    $('#settingsButton').show();
  } else {
    $('#settingsButton').hide();    
  }
});

socket.on('getUsernameResult', function(username) {
  $('#username').append(document.createTextNode(username));
});

socket.on('getArtistForSearchTermResult', function(data) {
  $("#search").autocomplete({
    position: { my : "right top", at: "right bottom" },
    source: data,
    appendTo:'#autocomplete',
    select: function( event , ui ) {
      autocompleteSelected(ui.item);
      ui.item.value = "";
    }
  })
});

socket.on('getNewsResultArtists', function(data) {

  $('#recentlyArtists').empty();
  hideContent();

  var divRow = document.createElement('div');
  divRow.className = 'row no-margin';

  for(var i in data) {      
    var imageElementDiv = document.createElement('div');
    imageElementDiv.className = 'recentlyArtistImage';
    var imageElement = document.createElement('img');
    imageElement.src = encodeURI(server+'/media/' + data[i].name + '/artist.jpg');
    imageElement.onerror = function() {
      this.onerror=null;
      this.src='';
    }
    imageElementDiv.appendChild(imageElement);

    var artistText = document.createElement('span');
    artistText.appendChild(document.createTextNode(data[i].name));
    imageElementDiv.appendChild(artistText);

    (function(artist){
    imageElementDiv.addEventListener("click", function() {
      socket.emit('getSongListForArtist', artist);
    }, false);
    })(data[i].name);

    divRow.appendChild(imageElementDiv);
  }

  $('#recentlyArtists').append(divRow);
  $('#newsView').show();
});

socket.on('getNewsResultAlbums', function(data) {
  
  $('#recentlyAlbums').empty();
  hideContent();
  $('#newsView').show();

  if(data.length==0) {
    return;
  }

  var divRow = document.createElement('div');
  divRow.className = 'row no-margin';

  for(var i in data) {      
    var imageElementDiv = document.createElement('div');
    imageElementDiv.className = 'recentlyAlbumImage';
    var imageElement = document.createElement('img');
    imageElement.src = encodeURI(server+'/media/' + data[i].artist + '/'+data[i].name+'/album.jpg');
    imageElement.onerror = function() {
      this.onerror=null;
      this.src='';
    }
    imageElementDiv.appendChild(imageElement);

    var artistText = document.createElement('span');
    if(data[i].name.length > 20) {
      artistText.appendChild(document.createTextNode(data[i].name.substring(0,20)+'...'));
    } else {
      artistText.appendChild(document.createTextNode(data[i].name));      
    }
    imageElementDiv.appendChild(artistText);

    (function(albumId){
    imageElementDiv.addEventListener("click", function() {
      socket.emit('getAlbumWithId', albumId);
    }, false);
    })(data[i].id);

    divRow.appendChild(imageElementDiv);
  }


  $('#recentlyAlbums').append(divRow);
});

socket.on('getArtistsResult', function(data) {

  $('#artists').empty();
  hideContent();

  for(var i in data) {      
    var imageElementDiv = document.createElement('div');
    imageElementDiv.className = 'artistsImage';
    var imageElement = document.createElement('img');
    imageElement.src = encodeURI(server+'/media/' + data[i].name + '/artist.jpg');
    imageElement.onerror = function() {
      this.onerror=null;
      this.src='';
    }
    imageElementDiv.appendChild(imageElement);

    var artistText = document.createElement('span');
    if(data[i].name.length > 10) {
      artistText.appendChild(document.createTextNode(data[i].name.substring(0,10)+'...'));
    } else {
      artistText.appendChild(document.createTextNode(data[i].name));      
    }
    imageElementDiv.appendChild(artistText);

    (function(artist){
    imageElementDiv.addEventListener("click", function() {
      socket.emit('getSongListForArtist', artist);
    }, false);
    })(data[i].name);

    $('#artists').append(imageElementDiv);
  }


  $('#artistsView').show();
});

socket.on('getAlbumsResult', function(data) {

  $('#albums').empty();
  hideContent();

  for(var i in data) {      
    var imageElementDiv = document.createElement('div');
    imageElementDiv.className = 'artistsImage';
    var imageElement = document.createElement('img');
    imageElement.src = encodeURI(server+'/media/' + data[i].artist + '/'+data[i].name+'/album.jpg');
    imageElement.onerror = function() {
      this.onerror=null;
      this.src='';
    }
    imageElementDiv.appendChild(imageElement);

    var artistText = document.createElement('span');
    if(data[i].name.length > 10) {
      artistText.appendChild(document.createTextNode(data[i].name.substring(0,10)+'...'));
    } else {
      artistText.appendChild(document.createTextNode(data[i].name));      
    }
    imageElementDiv.appendChild(artistText);

    (function(albumId){
    imageElementDiv.addEventListener("click", function() {
      socket.emit('getAlbumWithId', albumId);
    }, false);
    })(data[i].id);

    $('#albums').append(imageElementDiv);
  }


  $('#albumsView').show();
});

socket.on('getSongListForArtistResult', function(data) {

  $('#alben').empty();
  hideContent();

  document.getElementById("interpret").innerHTML = data.artist;

  //add Artist Banner
  document.getElementById("artist-banner").setAttribute('style', 'background-image:url("'+encodeURI(server+"/media/" + data.artist + "/artist_banner.jpg")+'")');
  
  for(var i in data.albums) {

    var album = data.albums[i];

    var divAlbumRow = document.createElement('div');
    divAlbumRow.className='row';

    addAlbumTitleToParentContainer(album.name, divAlbumRow);

    addAlbumImageToParentContainer(album.songs, data.artist, album.name, divAlbumRow);

    addSongListFromAlbumToParentContainer(album.songs, data.artist, album.name, divAlbumRow);

    $('#alben').append(divAlbumRow);
    $('#artistView').show();
  }
});

socket.on('getAlbumResult', function(data) {

  $('#albumViewAlben').empty();
  hideContent();

  for(var i in data) {
    var divAlbumRow = document.createElement('div');
    divAlbumRow.className='row';

    addAlbumTitleToParentContainer(data[i].name, divAlbumRow);

    addAlbumImageToParentContainer(data[i].songs, data[0].artist, data[0].name, divAlbumRow);

    addSongListFromAlbumToParentContainer(data[i].songs, data[i].artist, data[i].name, divAlbumRow);

    $('#albumViewAlben').append(divAlbumRow);
    $('#albumView').show();

  }
});

socket.on('getSongResult', function(data) {

  $('#songViewSongs').empty();
  hideContent();

  var divSongTable = document.createElement('div');
  divSongTable.className='col-lg-12 col-md-12 col-sm-12 col-xs-2';
  var songTable = document.createElement('table');
  songTable.className='table table-striped';
  var songTableBody = document.createElement('tbody');

  for(var i in data) {
    // var divSongRow = document.createElement('div');
    // divSongRow.className='row';
    var tableRow = document.createElement('tr');
    var columnTitle = document.createElement('td');
    columnTitle.appendChild(document.createTextNode(data[i].title));
    tableRow.appendChild(columnTitle);

    var columnArtist = document.createElement('td');
    columnArtist.appendChild(document.createTextNode(data[i].artist));
    tableRow.appendChild(columnArtist);

    var columnAlbum = document.createElement('td');
    columnAlbum.appendChild(document.createTextNode(data[i].album));
    tableRow.appendChild(columnAlbum);

    var columnAddToPlaylist = document.createElement('td');
    var a = document.createElement('a');
    (function(songId,title,album,artist, storagePath,flac){
      a.addEventListener("click", function() {
         addToPlaylist(songId,title,album,artist,storagePath,flac);
      }, false);
    })(data[i].id, data[i].title, data[i].album, data[i].artist, data[i].storagePath,data[i].flac);
    a.href='#';
    a.appendChild(document.createTextNode("+"));
    columnAddToPlaylist.appendChild(a);
    tableRow.appendChild(columnAddToPlaylist);
    songTableBody.appendChild(tableRow);
  }

  songTable.appendChild(songTableBody);
  divSongTable.appendChild(songTable);
  // container.appendChild(divSongTable);


  // addSongListFromAlbumToParentContainer(data[i].songs, data[i].artist, data[i].name, divSongRow);

  $('#songViewSongs').append(divSongTable);
  $('#songView').show();

});

socket.on('getPlaylistResult', function(data) {
  addPlaylistsToPlaylistNavigation(data);
});

socket.on('getPlaylistWithIdResult', function(data) {

  // removes the playlist slowly:
  createNewPlaylist();


  currentPlaylistId = data.id;

  document.getElementById("playlist-menu-name").value = data.name;

  for(var i in data.songs) {
    addToPlaylist(data.songs[i].id, data.songs[i].title,data.songs[i].album,data.songs[i].artist,data.songs[i].storagePath,data.songs[i].flac);
    // addToPlaylist(song.title,album,artist,song.storagePath);
  }
});

socket.on('changeUserPasswordResult', function(message) {
  alert(message);
});

// socket.on('songReady', function(path, mp3Path) {
//   console.log('song should be ready now');
//   // console.log(playlist);
//   var id = '#ajaxLoader'+path;
//   console.log(document.getElementById('ajaxLoader'+path));
//   document.getElementById('ajaxLoader'+path).remove();
//   // console.log(id);
//   // console.log($(id));
//   // $('#ajaxLoader'+path).remove();
//   for(var i in playlist.playlist) {
//     // console.log(playlist.playlist[i].path + " === " + path);
//     if(playlist.playlist[i].path === path) {
//       playlist.playlist[i].mp3 = mp3Path;
//       console.log('song is now:');
//       console.log(playlist.playlist[i]);
//       if(playlist.current == i) {
//         playlist.select(0);
//       }
//     }
//   }
// });


socket.on('getMpdListResult', function(data) {
  $('#outputDevice').hide();
  $('#outputDeviceList').empty();
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.href = '#';
  (function(id, name){
    a.addEventListener("click", function() {
      changeOutputDeviceTo(id, name);
    }, false);
  })(0, 'Stream');
  a.appendChild(document.createTextNode('Stream'));
  li.appendChild(a);
  $('#outputDeviceList').append(li);

  for(var i in data) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#';
    (function(id, name){
      a.addEventListener("click", function() {
        changeOutputDeviceTo(id, name);
      }, false);
    })(data[i].id, data[i].name);
    a.appendChild(document.createTextNode(data[i].name));
    li.appendChild(a);

    $('#outputDeviceList').append(li);
  }
  if(data.length>0) {
    $('#outputDevice').show();
  }
});

socket.on('mpdStatusUpdate', function(data) {

  if(data.song !== (playlist.current+1)) {
    playlist.select(parseInt(data.song));
  }

  if(data.state === 'play') {
    playFrontend();
  }
  if(data.state === 'pause') {
    pauseFrontend();
  }
  if(data.state === 'stop') {
    stopFrontend();
  }

  var volume = parseInt(data.volume)/100;
  $("#jquery_jplayer_1").jPlayer('volume', volume);
  setCurrentSongInfo();

});

function addToPlaylist(id, title, album, artist, path, flac, hash) {

  var hash = generateHash();

  var song = {
    id:id,
    title:title,
    artist:artist,
    // mp3:"/music/" + title + ".mp3",
    // mp3:"",
    mp3:"/media/"+path,
    flac:flac,
    // mp3:"/music/" + hash + ".mp3",
    path:path,
    poster:"/media/"+artist+"/"+album+"/album.jpg"
  }

  console.log('adding song:');
  console.log(song);

  // prepareSongFileForStream(path, hash);

  playlist.add(song);
  console.log(playlist.playlist);

  doMpdAction(function() {
    addSongToPlaylistMpd(song);
  });
  // addAjaxLoadingBar(path);
  prepareSongFileForStream(path);
}

$(document).ready(function(){
  hideContent();
  $('#pause').hide();
  $("#switch_device").bootstrapSwitch();

  $('#logout').bind('click', function() {
    $.post(window.location.protocol + "//" + window.location.host+"/logout").error(function(){
       alert("an error occurred");
    }).success(function(data) {
       window.location = data;
    });
  })

  $('#username').bind('click', function() {
    hideContent();
    $('#userConfigView').show();
  })

  $('#play').bind('click', function() {
    play();
  });

  $('#pause').bind('click', function() {
    doActionForSelectedOutputDevice(function() {
      pauseFrontend();
      pauseStream();
    },
    function() {
      pauseMpd();
    });
  });

  $('#next').bind('click', function() {
    // nextMpd();
    doActionForSelectedOutputDevice(function() {
      playlist.next();
    }, function() {
      if(playlist.current===(playlist.playlist.size-1)) {
        stopMpd();
        stopFrontend();
      }
      nextMpd();
    });
  });

  $('#previous').bind('click', function() {
    // nextMpd();
    doActionForSelectedOutputDevice(function() {
      playlist.previous();
    }, function() {
      previousMpd();
    });
  });

  $('#stop').bind('click', function() {
    // nextMpd();
    doActionForSelectedOutputDevice(function() {
      stopStream();
    }, function() {
      stopMpd();
      stopFrontend();
    });
  });

  $('#btn-save-playlist').bind('click', function() {
    if(document.getElementById("playlist-menu-name").value.length > 0) {
      socket.emit("saveCurrentPlaylist", currentPlaylistId, document.getElementById("playlist-menu-name").value, playlist.playlist);
    } else {
      alert("Playlist must be named!");
      document.getElementById("playlist-menu-name").focus();
    }
  });

  $('#btn-new-playlist').bind('click', function() {
    document.getElementById("playlist-menu-name").value = "New Playlist";

    createNewPlaylist();
  });

  $('#outputDevice').bind('click', function() {
    socket.emit('getListOfMpds');
    console.log('CLICKED - SHOULD NOW REQUEST LIST OF MPDS');
  })

  $('#streamrBody').keydown(function() {
    if(!$("#playlist-menu-name").is(":focus") && !$("#oldPassword").is(":focus") && !$("#newPassword").is(":focus") && !$("#newPasswordCheck").is(":focus")) {
      $('#search').focus();      
    }
  });


  $('#search').bind('input', function() {
    socket.emit("getArtistForSearchTerm", $(this).val());
  });

  $('#navigation_news').bind('click', function() {
    socket.emit('getNews');
  });

  $('#navigation_artists').bind('click', function() {
    console.log('should get Artists');
    socket.emit('getArtists');
  });

  $('#navigation_albums').bind('click', function() {
    socket.emit('getAlbums');
  });

  $('#btnChangePassword').bind('click', function() {
    var newPassword = $('#newPassword').val();
    if(newPassword === $('#newPasswordCheck').val()) {
      socket.emit('changeUserPassword', CryptoJS.SHA512($('#oldPassword').val()).toString(CryptoJS.enc.Hex), CryptoJS.SHA512(newPassword).toString(CryptoJS.enc.Hex));
      $('#oldPassword').val('');
      $('#newPassword').val('');
      $('#newPasswordCheck').val('');
    } else {
      alert("'New Password' and 'Retype new Password' must be equal!");
    }
  });

  socket.emit('getNews');



  $("#jquery_jplayer_1").jPlayer({
    ready: function () {
    },
    play: function() {
      playFrontend();
      setCurrentSongInfo();
    },
    pause: function() {
      pauseFrontend();
    },
    supplied: "mp3",
    size: {width: "100%", height: "100%"}
  });


  // var volumeBarOriginal = $.jPlayer.prototype.volumeBar.bind({});
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
        setVolumeMpd(Math.round(x/w*100));
      }
    }
    if(this.options.muted) {
      this._muted(false);
    }
  }

  // playlist.nextStream = playlist.next;
  // playlist.nextMpd = nextMpd();
  // playlist.next = function() {
  //   console.log('checks for next functionality');
  //   doActionForSelectedOutputDevice(function() {
  //     playlist.nextStream();
  //   }, function() {
  //     nextMpd();
  //   });
    // if(!$('#switch_device').bootstrapSwitch('state')) {
    //   console.log('should play next song on mpd');
    // } else {
    //   playlist.nextStream();
    // }
  // }

  // playlist.previousStream = playlist.previous;
  // // playlist.previousMpd = previousMpd();
  // playlist.previous = function() {
  //   if(!$('#switch_device').bootstrapSwitch('state')) {
  //     console.log('should play prev song on mpd');
  //   } else {
  //     playlist.previousStream();
  //   }
  // 
// }
  jPlayerPlaylist.prototype._createItemHandlers = function() {
      var self = this;
      // Create live handlers for the playlist items
      $(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.itemClass).on("click", "a." + this.options.playlistOptions.itemClass, function() {
      console.log(self);
        var index = $(this).parent().parent().index();
        if(self.current !== index) {
          playSongInPlaylist(index);
        } else {
          play();
        }
        $(this).blur();
        return false;
        console.log('TEST');
      });

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
      supplied: "mp3"
    });


  currentPlaylistId = undefined;

  $("#sortable").sortable({
    start: function(event, ui) {
        ui.item.startPos = ui.item.index();
    },
    stop: function(event, ui) {
        changePositionInPlaylist(ui.item.startPos,ui.item.index());
    },
    out: function( event, ui ) {
    }
  });

  window.onbeforeunload = function() { return "With this action the music will stop."; };
});

function playMpd(index) {
  socket.emit('mpdPlay', index);
  console.log('mpd will play');
}

function nextMpd() {
  socket.emit('mpdNext');
}

function previousMpd() {
  socket.emit('mpdPrevious');
}

function stopMpd() {
  socket.emit('mpdStop');
  console.log('mpd will stop');
}

function playStream(position) {
  if(position) {
    playlist.select(parseInt(position));    
  }
  $("#jquery_jplayer_1").jPlayer('play');
}

function pauseMpd() {
  console.log('should pause now on MPD');
  socket.emit('mpdPause');
}

function pauseStream() {
  $("#jquery_jplayer_1").jPlayer('pause');  
}

function stopStream() {
  $("#jquery_jplayer_1").jPlayer('stop');    
}

function setCurrentSongInfo() {
  $('#current-song-info-title').text($("#jquery_jplayer_1").data("jPlayer").status.media.title);
  $('#current-song-info-artist').text($("#jquery_jplayer_1").data("jPlayer").status.media.artist);
}

function changePositionInPlaylist(originalIndex, finalIndex) {

  if(originalIndex>finalIndex) {

    var cacheSong = playlist.playlist[originalIndex];

    playlist.playlist.splice(originalIndex,1);

    playlist.playlist.splice(finalIndex,0,cacheSong);
  }

  doMpdAction(function() {
    socket.emit('mpdChangeSongPosition', originalIndex+1, finalIndex+1);
  });
};

function generateHash() {
  hashCounter++;
  return hashCounter;
}

function hideContent() {
  $('#albumView').hide();
  $('#artistView').hide();
  $('#songView').hide();
  $('#artistsView').hide();
  $('#albumsView').hide();
  $('#newsView').hide();
  $('#userConfigView').hide();
}

function updateMusicDatabase() {
  socket.emit('updateMusicDatabase');
}

function prepareSongFileForStream(path) {
  socket.emit("prepareSongForStreaming", path);
}

function getCurrentUrl() {
  var url = document.URL;
  url = url.substring(0,url.lastIndexOf("/"));
  return url;
}

function autocompleteSelected(uiItem) {
  if(uiItem.category === 'Artists') {
    socket.emit("getSongListForArtist", uiItem.value);
  }
  if(uiItem.category === 'Albums') {
    socket.emit("getAlbum", uiItem.value);
  }
  if(uiItem.category === 'Songs') {
    socket.emit("getSong", uiItem.value);
  }
}

function openPlaylist(playlistId) {
  socket.emit('getPlaylistWithId', playlistId);
}

function addAlbumTitleToParentContainer(albumName, container) {
    var divHeadline = document.createElement('div');
    divHeadline.className='col-lg-12 albumHeadline';
    var headline = document.createElement('h3');
    headline.appendChild(document.createTextNode(albumName));
    divHeadline.appendChild(headline);
    container.appendChild(divHeadline);  
}

function addAlbumImageToParentContainer(songs, artistName, albumName, container) {
    var divImage = document.createElement('div');
    divImage.className='col-lg-3 col-md-3 col-sm-3 col-xs-3';
    var albumImage = document.createElement('img');
    albumImage.src = "/media/"+artistName+"/"+albumName+"/album.jpg";
    albumImage.className = "albumImage";
    albumImage.onmouseover = function() {
      var divOverlay = document.createElement('div');
      divOverlay.className='albumImageOverlay';
      divOverlay.id='albumImageOverlay';
      divOverlay.onmouseout = function(event) {
        var e = event.toElement || event.relatedTarget;
        if(e.parentNode == this || e == this) {
          return;
        }
        $('#albumImageOverlay').remove();
      };

      var playSymbol = document.createElement('span');
      playSymbol.className='glyphicon glyphicon-play';
      divOverlay.appendChild(playSymbol);

      var plusSymbol = document.createElement('span');
      plusSymbol.className='glyphicon glyphicon-plus';
      divOverlay.appendChild(plusSymbol);

      (function(songs, albumName, artistName){
        plusSymbol.addEventListener("click", function() {
          for(var songcount in songs) {
             addToPlaylist(songs[songcount].id, songs[songcount].title,albumName,artistName,songs[songcount].storagePath,songs[songcount].flac);          
          }
        }, false);
      })(songs, albumName, artistName);

      (function(songs, albumName, artistName){
        playSymbol.addEventListener("click", function() {
          createNewPlaylist();

          for(var songcount in songs) {
            document.getElementById("playlist-menu-name").value = "New Playlist";

              addToPlaylist(songs[songcount].id, songs[songcount].title,albumName,artistName,songs[songcount].storagePath,songs[songcount].flac);

              play();
          }
        }, false);
      })(songs, albumName, artistName);

      divImage.appendChild(divOverlay);
    };
    divImage.appendChild(albumImage);
    container.appendChild(divImage);
}

function addSongListFromAlbumToParentContainer(songs, artistName, albumName, container) {
  var divSongTable = document.createElement('div');
  divSongTable.className='col-lg-9 col-md-9 col-sm-9 col-xs-2';
  var songTable = document.createElement('table');
  songTable.className='table songlist table-striped';
  var songTableBody = document.createElement('tbody');
  for(var j in songs) {
    var tableRow = document.createElement('tr');
    var columnPosition = document.createElement('td');
    columnPosition.appendChild(document.createTextNode(songs[j].songPosition));
    tableRow.appendChild(columnPosition);
    var columnTitle = document.createElement('td');
    var aTitle = document.createElement('a');
    aTitle.href = '#';

    (function(songs, albumName, artistName, playPosition){
      aTitle.addEventListener("click", function() {
        createNewPlaylist();

        for(var songcount in songs) {
          document.getElementById("playlist-menu-name").value = "New Playlist";

            addToPlaylist(songs[songcount].id, songs[songcount].title,albumName,artistName,songs[songcount].storagePath,songs[songcount].flac);

        }
        play(playPosition);
      }, false);
    })(songs, albumName, artistName, j);

    aTitle.appendChild(document.createTextNode(songs[j].title));
    columnTitle.appendChild(aTitle);
    // columnTitle.appendChild(document.createTextNode(songs[j].title));
    tableRow.appendChild(columnTitle);

    var columnAddToPlaylist = document.createElement('td');
    var a = document.createElement('a');
    (function(song,album,artist){
      a.addEventListener("click", function() {
         addToPlaylist(song.id, song.title,album,artist,song.storagePath,song.flac);
      }, false);
    })(songs[j],albumName,artistName);
    a.href='#';
    a.appendChild(document.createTextNode("+"));
    columnAddToPlaylist.appendChild(a);
    tableRow.appendChild(columnAddToPlaylist);
    songTableBody.appendChild(tableRow);
  }
  songTable.appendChild(songTableBody);
  divSongTable.appendChild(songTable);
  container.appendChild(divSongTable);
}

function addPlaylistsToPlaylistNavigation(playlists) {

  $('#playlist-collection').empty();
  var tbody = document.createElement('tbody');

  for(var i in playlists) {

    var trElement = document.createElement('tr');
    var tdElement = document.createElement('td');
    var a = document.createElement('a');
    (function(playlist){
      a.addEventListener("click", function() {
        openPlaylist(playlist.id);
      }, false);
    })(playlists[i]);
    var divPlaylistItem = document.createElement('div');
    divPlaylistItem.className='side-navigation-playlist-item';
    divPlaylistItem.appendChild(document.createTextNode(playlists[i].name));
    a.appendChild(divPlaylistItem);
    tdElement.appendChild(a);
    trElement.appendChild(tdElement);
    tbody.appendChild(trElement);
  }
    document.getElementById('playlist-collection').appendChild(tbody);

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
  if(playlist.playlist.length===0) {
    return;
  }
  doActionForSelectedOutputDevice(function() {
    playFrontend();
    playStream(index);    
  },function() {
    if(index) {
      playlist.select(index);
      index = index+1;
    }
    playMpd(index);
  });
}


function parseMp3PathInPlaylist() {
  var current = playlist.current;
  for(var i in playlist.playlist) {
    playlist.select(i);
  }
  playlist.select(current);
  
}

function doActionForSelectedOutputDevice(streamAction, mpdAction) {
  if(currentOutputDeviceId!==0) {
    mpdAction();
    return;
  }
  streamAction();
}

function doMpdAction(mpdAction) {
  doActionForSelectedOutputDevice(function() {},mpdAction);
}

function stopFrontend() {
  $('#play').show();
  $('#pause').hide();
}

function playFrontend() {
  $('#play').hide();
  $('#pause').show();
}

function pauseFrontend() {
  $('#play').show();
  $('#pause').hide();
}

function playSongInPlaylist(index) {
  play(index);
}

function addSongToPlaylistMpd(song) {
  parseMp3PathInPlaylist();
  socket.emit("mpdAddSong", song.mp3, song.flac);
}

function setVolumeMpd(volume) {
  socket.emit("mpdSetVolume", volume);
}

function setPlaylistMpd() {
  parseMp3PathInPlaylist();
  socket.emit('mpdSetPlaylist', playlist.playlist);
}

function changeOutputDeviceTo(id, name) {
  socket.emit('outputDeviceSelected', id);
  currentOutputDeviceId = id;
  $('#currentDeviceName').text(name);
  if(id!==0) {
    var currentTime = $('#current-time').text();
    setPlaylistMpd();
    socket.emit('mpdSetCurrentSong', playlist.current);

    if($('#play').is(":hidden")) {
      //playing
      playMpd();
      seekMpd(currentTime);
      return;
      //play at current Time
    }
    return;
  }
  if($('#play').is(":hidden")) {
    stopMpd();
    playStream();
  }
}

function seekMpd(time) {
  socket.emit('mpdSeek', time);
}

function getTwoDigitNumber(number) {
  var stringNumber = number + '';
  if(stringNumber.length===1) {
    stringNumber = '0'+stringNumber;
  }
  return stringNumber;
}



function login() {
    var username = $('#username').val();
    var password = $('#password').val();
    var hash = CryptoJS.SHA512(password);
    $.post(server, { username: username, password: hash.toString(CryptoJS.enc.Hex) } ).error(function(){
       alert("an error occurred");
    }).success(function(data){
    });  
}


// function addAjaxLoadingBar(path) {
//   if(playlist.playlist.length>1) {
//     var imgLoadingAjax = document.createElement('img');
//     // imgLoadingAjax.src = '/img/ajax-loader.gif';
//     imgLoadingAjax.src = 'http://ajaxload.info/cache/33/33/33/66/66/66/1-0.gif';
//     imgLoadingAjax.id = 'ajaxLoader'+path;
//     console.log($('ul.playlist li'));
//     $('ul.playlist li')[$('ul.playlist li').length-1].appendChild(imgLoadingAjax);
//     // console.log($('li.jp-playlist').length);
//     // $('li.jp-playlist')[$('li.jp-playlist').length-2].appendChild(imgLoadingAjax);
//     // console.log($('ul.playlist'));

//   } else {
//     var imgLoadingAjax = document.createElement('img');
//     imgLoadingAjax.src = '/img/ajax-loader.gif';
//     // imgLoadingAjax.src = 'http://ajaxload.info/cache/33/33/33/66/66/66/1-0.gif';
//     imgLoadingAjax.id = 'ajaxLoader'+path;
//     console.log($('li.jp-playlist-current'));
//     $('li.jp-playlist-current')[0].appendChild(imgLoadingAjax);
//   }
  //       $(this.cssSelector.title + " li").html(this.playlist[index].title + (this.playlist[index].artist ? " <span class='jp-artist'>by " + this.playlist[index].artist + "</span>" : ""));
  // var playlist = $('ul.playlist');
  // var listElement = $('ul.playlist').find("li");
  // var songElement = listElement[listElement.length-1];
  // console.log(listElement);
  // console.log(songElement);

  // // var testText = document.createElement('div');

  // //   testText.appendChild(document.createTextNode('Test'));
  // //   songElement.appendChild(imgLoadingAjax);
  // //   listElement[listElement.length-1].html(songElement.html());
  //   // $('ul.playlist').listview('refresh');

  // var imgLoadingAjax = document.createElement('img');
  // imgLoadingAjax.src = '/img/ajax-loader.gif';
  // imgLoadingAjax.id = 'ajaxLoader'+path;
  // console.log('will append');
  // songElement.appendChild(imgLoadingAjax);
  // songElement.html(songElement.html());
// 
// }


    