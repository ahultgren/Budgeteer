'use strict';

var Baobab = require('baobab');
var Bacon = require('baconjs');
var R = require('ramda');

// Monkey patch cursors to get them as Bacon properties
var Cursor = require('baobab/src/cursor');
var Facet = require('baobab/src/facet');

Cursor.prototype.asProperty = Facet.prototype.asProperty = function () {
  var cursor = this;

  return Bacon.fromEventTarget(cursor, 'update')
    .map(() => cursor.get())
    .toProperty(cursor.get());
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//## Let users create these
var categories = [
  {
    name: 'Rent',
    id: 'Rent-default',
    type: 'expense',
    budget: 54000,
  },
  {
    name: 'Food',
    id: 'Food-default',
    type: 'expense',
    budget: 24000,
  },
  {
    name: 'Travel',
    id: 'Travel-default',
    type: 'expense',
    budget: 12000,
  },
  {
    name: 'Salary',
    id: 'Salary-default',
    type: 'income',
    budget: 120000,
  }
];

module.exports = new Baobab({
  currentPlanId: 'default-plan',
  plans: [
    {
      name: 'Sample plan',
      id: 'default-plan',
      periods: [].concat(MONTHS, MONTHS).slice(new Date().getMonth(), new Date().getMonth() + 6),
      entries: [],
      categories: categories,
    }
  ],
}, {
  facets: {
    currentPlan: {
      cursors: {
        id: 'currentPlanId',
        plans: 'plans',
      },
      get ({id, plans}) {
        return R.find(R.propEq('id', id), plans) || {};
      }
    },
    currentCategories: {
      cursors: {
        id: 'currentPlanId',
        plans: 'plans',
      },
      get ({id, plans}) {
        var plan = R.find(R.propEq('id', id), plans);
        return plan && plan.categories || [];
      }
    },
    currentEntries: {
      cursors: {
        id: 'currentPlanId',
        plans: 'plans',
      },
      get ({id, plans}) {
        var plan = R.find(R.propEq('id', id), plans);
        return plan && plan.entries || [];
      }
    },
    currentPeriods: {
      cursors: {
        id: 'currentPlanId',
        plans: 'plans',
      },
      get ({id, plans}) {
        var plan = R.find(R.propEq('id', id), plans);
        return plan && plan.periods;
      }
    },
  }
});
