'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var Omnium = require('../utils/omnium');

var hasPeriod = R.propEq('period');
var incMinusExp = (entry) => +entry.income - entry.expense;

var removeEntryById = (entries, id) => {
  var entryIndex = R.findIndex(R.propEq('id', id))(entries.get());

  if(entryIndex > -1) {
    entries.splice([entryIndex, 1]);
  }
};

var entryTemplate = (entry) => {
  return `
    <tr class="actions-row">
      <td>
        <div class="actions-box">
          <button class="js-remove btn btn-xs btn-danger" data-id="${entry.id}"><i class="glyphicon glyphicon-minus"></i></button>
        </div>
        <span>${entry.category}</span>
      </td>
      <td>${entry.description || ''}</td>
      <td>${entry.expense || ''}</td>
      <td>${entry.income || ''}</td>
    </tr>
  `;
};

var table = (period, entries) => {
  return `<div>
    <table class="table table-bordered table-hover">
      <caption>${period}</caption>
      <thead>
        <tr>
          <th>Category</th>
          <th>Comment</th>
          <th>Expense</th>
          <th>Income</th>
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

var template = function ({entries, periods}) {
  return `
    <div>
      ${periods.map((period) => {
        return table(period, entries.filter(hasPeriod(period)));
      }).join('')}
    </div>
  `;
};

exports.init = function (elem, state) {
  var entries = state.select('entries');
  var periods = state.select('periods');

  var render = Omnium.create({
    template,
    parent: elem.get(0)
  });

  Bacon.combineTemplate({
    entries: entries.asProperty(),
    periods: periods.asProperty(),
  })
  .onValue(render);

  elem.asEventStream('click', '.js-remove')
  .map('.currentTarget').map($)
  .onValue((button) => {
    removeEntryById(entries, button.attr('data-id'));
  });
};
