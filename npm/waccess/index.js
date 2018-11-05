function Waccess() {

  if (!window) {
    throw new Error('Sorry, this is a browser modul.');
  }

  let $waccess = window.$waccess;

  if (!$waccess) {

    $waccess = {}

    window.$waccess = $waccess;

    require('./waccess');

  }

  return {
    init: function() { return this; },
    activateWaccess: $waccess.activateWaccess,
    focusElement: $waccess.focusElement,
    scanAgain: $waccess.scanAgain
  }
};

const waccess = new Waccess();

exports.Waccess = waccess;
