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

//## Let users create these
var categories = [
  'Rent',
  'Food',
  'Travel'
];

module.exports = new Baobab({
  periods: ['April', 'May', 'June', 'August', 'September', 'October'],
  categories: categories,
  entries: []
});
