'use strict';

var Baobab = require('baobab');
var Bacon = require('baconjs');

// Monkey patch cursors to get them as Bacon properties
var Cursor = require('baobab/src/cursor');

Cursor.prototype.asProperty = function () {
  var cursor = this;

  return Bacon.fromEventTarget(cursor, 'update')
    .map(() => cursor.get())
    .toProperty(cursor.get());
};

module.exports = new Baobab({
  entries: []
});
