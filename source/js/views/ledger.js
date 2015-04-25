'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var Omnium = require('../utils/omnium');

var incMinusExp = (entry) => {
  return +entry.income - entry.expense;
};

var entryTemplate = (entry) => {
  return `
    <tr>
      <td>${entry.date}</td>
      <td>${entry.category}</td>
      <td>${entry.description || ''}</td>
      <td>${entry.expense || ''}</td>
      <td>${entry.income || ''}</td>
    </tr>
  `;
};

var template = function ({entries}) {
  return `<div>
    <table class="table table-bordered table-hover">
      <caption>Ledger</caption>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Comment</th>
          <th>Income</th>
          <th>Expense</th>
        </tr>
      </thead>
      <tbody>
        ${entries.map(entryTemplate).join('')}
      </tbody>
    </table>
    <p>
      Total: ${R.sum(entries.map(incMinusExp).map(Number))}
    </p>
  </div>`;
};

exports.init = function (elem, state) {
  var entries = state.select('entries');
  var render = Omnium.create({
    template,
    parent: elem.get(0)
  });

  Bacon.combineTemplate({
    entries: entries.asProperty()
  })
  .onValue(render);
};
