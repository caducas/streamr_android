var gui = require('nw.gui');

  var optionNext = {
    key : "MediaNextTrack",
    active : function() {
      next();
    },
    failed : function(msg) {
      // :(, fail to register the |key| or couldn't parse the |key|.
      console.log(msg);
    }
  };

  var optionPrevious = {
    key : "MediaPrevTrack",
    active : function() {
      prev();
    },
    failed : function(msg) {
      // :(, fail to register the |key| or couldn't parse the |key|.
      console.log(msg);
    }
  };

  var optionPause = {
    key : "MediaPlayPause",
    active : function() {
      playPause();
    },
    failed : function(msg) {
      // :(, fail to register the |key| or couldn't parse the |key|.
      console.log(msg);
    }
  };



  // Create a shortcut with |option|.
  var shortcutNext = new gui.Shortcut(optionNext);
  var shortcutPrevious = new gui.Shortcut(optionPrevious);
  var shortcutPause = new gui.Shortcut(optionPause);

  // Register global desktop shortcut, which can work without focus.
  gui.App.registerGlobalHotKey(shortcutNext);
  gui.App.registerGlobalHotKey(shortcutPrevious);
  gui.App.registerGlobalHotKey(shortcutPause);

  console.log('shortcuts assigned');



// If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
// will get an "active" event.

// You can also add listener to shortcut's active and failed event.
// shortcut.on('active', function() {
//   console.log("Global desktop keyboard shortcut: " + this.key + " active."); 
// });

// shortcut.on('failed', function(msg) {
//   console.log(msg);
// });

// Unregister the global desktop shortcut.
// gui.App.unregisterGlobalHotKey(shortcut);