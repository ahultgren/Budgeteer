'use strict';

var state = require('./state');
var localstate = require('./modules/localstate');
var actions = require('./modules/actions');

var ledger = require('./views/ledger');
var addEntry = require('./views/addEntry');
var budget = require('./views/budget');
var addCategory = require('./views/addCategory');

localstate.load('state', state);
localstate.sync('state', state);

//## Temporary solution while refactoring views to use state-actions
var viewState = {
  entries: state.select('plans', '0', 'entries'),
  categories: state.select('categories'),
  periods: state.select('plans', '0', 'periods'),
};

ledger.init($('.js-ledger'), viewState, actions);
addEntry.init($('.js-add-entry'), viewState, actions);
budget.init($('.js-budget'), viewState, actions);
addCategory.init($('.js-add-category'), viewState, actions);
