'use strict';

var R  =require('ramda');
var uuid = require('uuid');
var state = require('../state');

var actions = module.exports = {
  getCurrentPlan () {
    var id = state.select('currentPlanId').get();
    var index = R.findIndex(R.propEq('id', id))(state.select('plans').get());
    return state.select('plans', index);
  },

  addCategory ({type, name, budget}) {
    state.select('categories').push({
      type, name, budget,
      id: uuid.v4(),
    });
  },

  addEntry ({description, category, expense, income, period}) {
    actions.getCurrentPlan().select('entries').push({
      description, category, expense, income, period,
      id: uuid.v4(),
    });
  },

  addPeriod ({name, periods}) {
    state.select('plans').push({
      name, periods,
      id: uuid.v4(),
      entries: [],
    });
  },

  updateCurrentPlan (id) {
    state.select('currentPlanId').set(id);
  },

  removeCategory (id) {
    var categories = state.select('categories');
    var categoryIndex = R.findIndex(R.propEq('id', id))(categories.get());

    if(categoryIndex > -1) {
      categories.splice([categoryIndex, 1]);
    }
  },

  removeEntry (id) {
    var entries = actions.getCurrentPlan().select('entries');
    var entryIndex = R.findIndex(R.propEq('id', id))(entries.get());

    if(entryIndex > -1) {
      entries.splice([entryIndex, 1]);
    }
  },

  removePlan (id) {
    var plans = state.select('plans');
    var planIndex = R.findIndex(R.propEq('id', id))(plans.get());

    if(planIndex > -1) {
      plans.splice([planIndex, 1]);
    }
  },

};
