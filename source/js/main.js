'use strict';

var state = require('./state');
var localstate = require('./modules/localstate');
var actions = require('./modules/actions');

var ledger = require('./views/ledger');
var addEntry = require('./views/addEntry');
var budget = require('./views/budget');
var addCategory = require('./views/addCategory');
var plans = require('./views/plans');

localstate.load('state', state);
localstate.sync('state', state);

var viewState = {
  plans: state.select('plans'),
  currentPlanId: state.select('currentPlanId'),
  categories: state.select('categories'),
  entries: state.facets.currentEntries,
  periods: state.facets.currentPeriods,
};

ledger.init($('.js-ledger'), viewState, actions);
addEntry.init($('.js-add-entry'), viewState, actions);
budget.init($('.js-budget'), viewState, actions);
addCategory.init($('.js-add-category'), viewState, actions);
plans.init($('.js-plans'), viewState, actions);
