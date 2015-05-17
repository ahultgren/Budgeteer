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
    actions.getCurrentPlan().select('categories').push({
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

  addPlan ({name, periods, categories = []}) { // jshint ignore:line
    state.select('plans').push({
      name, periods,
      id: uuid.v4(),
      entries: [],
      categories: categories
    });
  },

  updateCategory (id, fields) {
    var categories = actions.getCurrentPlan().select('categories');
    var categoryIndex = R.findIndex(R.propEq('id', id))(categories.get());

    if(categoryIndex > -1) {
      let category = actions.getCurrentPlan().select('categories', categoryIndex);

      Object.keys(fields).forEach((key) => {
        category.set(key, fields[key]);
      });
    }
  },

  updateEntry (id, fields) {
    var entries = actions.getCurrentPlan().select('entries');
    var entryIndex = R.findIndex(R.propEq('id', id))(entries.get());

    if(entryIndex > -1) {
      let entry = actions.getCurrentPlan().select('entries', entryIndex);

      Object.keys(fields).forEach((key) => {
        entry.set(key, fields[key]);
      });
    }
  },

  updateCurrentPlan (id) {
    state.select('currentPlanId').set(id);
  },

  removeCategory (id) {
    var categories = actions.getCurrentPlan().select('categories');
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

  loadAllData (data) {
    //## Validate?
    Object.keys(data).forEach((key) => {
      state.set(key, data[key]);
    });
  },

};
