'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var Omnium = require('../utils/omnium');

var hasPeriod = R.propEq('period');
var incMinusExp = (entry) => +entry.income - entry.expense;

var categoryOption = R.curry((current, {id, name}) => {
  var selected = current === id ? 'selected' : '';
  return `<option value="${id}" ${selected}>${name}</option>`;
});

var categorySelect = (categories, current) => {
  return `
    <select class="editable form-control input-sm" data-field="category">
      ${categories.map(categoryOption(current)).join('')}
    </select>
  `;
};

var entryTemplate = R.curry((categories, entry) => {
  return `
    <tr class="actions-row" data-id="${entry.id}">
      <td>
        <div class="actions-box">
          <button class="js-remove btn btn-xs btn-danger" data-id="${entry.id}"><i class="glyphicon glyphicon-minus"></i></button>
        </div>
        ${categorySelect(categories, entry.category)}
      </td>
      <td>
        <input class="editable" data-field="description" value="${entry.description || ''}">
      </td>
      <td>
        <input type="number" data-field="expense" class="editable" value="${entry.expense || ''}">
      </td>
      <td>
        <input type="number" data-field="income" class="editable" value="${entry.income || ''}">
      </td>
    </tr>
  `;
});

var table = (period, entries, categories) => {
  var result = R.sum(entries.map(incMinusExp).map(Number));
  var negative = result < 0 ? 'u-negative' : '';

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
        ${entries.map(entryTemplate(categories)).join('')}
      </tbody>
    </table>
    <p>
      Result: <span class="${negative}">${result}</span>
    </p>
  </div>`;
};

var template = function ({entries, periods, categories}) {
  if(!periods) {
    return `<div>No plan selected</div>`;
  }

  return `
    <div>
      ${periods.map((period) => {
        return table(period, entries.filter(hasPeriod(period)), categories);
      }).join('')}
    </div>
  `;
};

exports.init = function (elem, {periods, entries, categories}, actions) {
  var render = Omnium.create({
    template,
    parent: elem.get(0)
  });

  Bacon.combineTemplate({
    entries: entries.asProperty(),
    periods: periods.asProperty(),
    categories: categories.asProperty(),
  })
  .onValue(render);

  elem.asEventStream('click', '.js-remove')
  .map('.currentTarget').map($)
  .onValue((button) => {
    actions.removeEntry(button.attr('data-id'));
  });

  elem.asEventStream('change')
  .map('.target').map($)
  .onValue((field) => {
    var id = field.closest('tr').attr('data-id');
    var key = field.attr('data-field');
    var value = field.val();

    actions.updateEntry(id, {
      [key]: value
    });
  });
};
