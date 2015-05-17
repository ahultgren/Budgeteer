'use strict';

var state = require('./state');
var localstate = require('./modules/localstate');
var actions = require('./modules/actions');

var ledger = require('./views/ledger');
var budget = require('./views/budget');
var addCategory = require('./views/addCategory');
var plans = require('./views/plans');
var addPlan = require('./views/addPlan');
var exporter = require('./views/exporter');
var importer = require('./views/importer');

localstate.load('state', state);
localstate.sync('state', state);

var viewState = {
  state,
  plans: state.select('plans'),
  currentPlanId: state.select('currentPlanId'),
  categories: state.facets.currentCategories,
  entries: state.facets.currentEntries,
  periods: state.facets.currentPeriods,
};

ledger.init($('.js-ledger'), viewState, actions);
budget.init($('.js-budget'), viewState, actions);
addCategory.init($('.js-add-category'), viewState, actions);
plans.init($('.js-plans'), viewState, actions);
addPlan.init($('.js-add-plan'), viewState, actions);
exporter.init($('.js-exporter'), viewState, actions);
importer.init($('.js-importer'), viewState, actions);
