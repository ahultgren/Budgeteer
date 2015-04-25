'use strict';

exports.sync = (lsKey, tree) => {
  tree.on('update', function () {
    window.localStorage.setItem(lsKey, JSON.stringify(tree.get()));
  });
};

exports.load = (lsKey, tree) => {
  var stored = JSON.parse(window.localStorage.getItem(lsKey) || 'null');

  if(stored && typeof stored === 'object') {
    Object.keys(stored).forEach((key) => {
      tree.set(key, stored[key]);
    });
  }
};
