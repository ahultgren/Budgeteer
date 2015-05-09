'use strict';

var R  =require('ramda');
var uuid = require('uuid');
var state = require('../state');

var actions = module.exports = {
  getCurrentPlan () {
    return state.select('plans', '0');
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

};
