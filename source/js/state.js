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
  {
    name: 'Rent',
    type: 'expense',
    budget: 54000,
  },
  {
    name: 'Food',
    type: 'expense',
    budget: 24000,
  },
  {
    name: 'Travel',
    type: 'expense',
    budget: 12000,
  },
  {
    name: 'Salary',
    type: 'income',
    budget: 120000,
  }
];

module.exports = new Baobab({
  periods: ['April', 'May', 'June', 'August', 'September', 'October'],
  categories: categories,
  entries: []
});
