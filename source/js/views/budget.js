'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var Omnium = require('../utils/omnium');

var hasCategory = R.propEq('category');
var hasPeriod = R.propEq('period');
var spentInPeriod = (entries, category, period, summer) => entries
  .filter(hasCategory(category.id))
  .filter(hasPeriod(period))
  .map(summer)
  .reduce(R.add, 0);

var expMinusInc = entry => +entry.expense - entry.income;
var incMinusExp = entry => +entry.income - entry.expense;
var periodHeader = period => `<th>${period}</th>`;

var categoryRow = (periods, entries, summer) => (category) => {
  var periodResults = periods.map((period) => {
    return `
      <td>${spentInPeriod(entries, category, period, summer)}</td>
    `;
  }).join('');

  var amountLeft = category.budget;
  var periodBudgets = periods.map((period, i) => {
    //## Take into consideration if period is past to move leftovers forward?

    var maxBudgetThisPeriod = amountLeft/(periods.length - i);
    var spentThisPeriod = spentInPeriod(entries, category, period, summer);
    var budgetThisPeriod = Math.max(maxBudgetThisPeriod, spentThisPeriod);
    var leftThisPeriod = budgetThisPeriod - spentThisPeriod;

    amountLeft -= budgetThisPeriod;

    return `
      <td>${(leftThisPeriod).toFixed(0)}</td>
    `;
  }).join('');

  var total = entries
    .filter(hasCategory(category.id))
    .map(summer)
    .reduce(R.add, 0);
  var negative = category.budget - total < 0 ? 'u-negative' : '';

  return `
    <tr class="actions-row" data-id="${category.id}">
      <td>
        <div class="actions-box">
          <button class="js-remove btn btn-xs btn-danger" data-id="${category.id}"><i class="glyphicon glyphicon-minus"></i></button>
        </div>
        <input class="editable" data-field="name" value="${category.name}">
      </td>
      ${periodResults}
      <td>${total}</td>
    </tr>
    <tr data-id="${category.id}">
      <td><input class="editable" data-field="budget" value="${category.budget}"></td>
      ${periodBudgets}
      <td class="${negative}">${category.budget - total}</td>
    </tr>
  `;
};

var table = (periods) => (title, body) => {
  return `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>${title}</th>
          ${periods.map(periodHeader).join('')}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${body}
      </tbody>
    </table>
  `;
};

var periodResultBalance = (entries) => (period) => {
  var balance = entries
    .filter(hasPeriod(period))
    .map(incMinusExp)
    .reduce(R.add, 0);
  var negative = balance < 0 ? 'u-negative' : '';

  return `<td class="${negative}">${balance}</td>`;
};

var totalResultBalance = (entries) => {
  return entries.map(incMinusExp).reduce(R.add, 0);
};

var balance = (entries, periods) => {
  var total = totalResultBalance(entries);
  var negative = total < 0 ? 'u-negative' : '';

  return `
    <tr>
      <td>Balance</td>
      ${periods.map(periodResultBalance(entries)).join('')}
      <td class="${negative}">${total}</td>
    </tr>
  `;
};

var template = ({periods, categories, entries}) => {
  if(!periods) {
    return `<div>No plan selected</div>`;
  }

  var expenses = categories.filter(R.propEq('type', 'expense'));
  var incomes = categories.filter(R.propEq('type', 'income'));
  var periodTable = table(periods);

  return `
    <div>
      ${periodTable('Expenses', expenses.map(categoryRow(periods, entries, expMinusInc)).join(''))}
      ${periodTable('Incomes', incomes.map(categoryRow(periods, entries, incMinusExp)).join(''))}
      ${periodTable('Result', balance(entries, periods))}
    </div>
  `;
};

exports.init = (elem, {periods, categories, entries}, actions) => {
  var render = Omnium.create({
    template,
    parent: elem.get(0)
  });

  Bacon.combineTemplate({
    periods: periods.asProperty(),
    categories: categories.asProperty(),
    entries: entries.asProperty(),
  })
  .onValue(render);

  elem.asEventStream('click', '.js-remove')
  .map('.currentTarget').map($)
  .onValue((button) => {
    actions.removeCategory(button.attr('data-id'));
  });

  elem.asEventStream('change')
  .map('.target').map($)
  .onValue((field) => {
    var id = field.closest('tr').attr('data-id');
    var key = field.attr('data-field');
    var value = field.val();

    actions.updateCategory(id, {
      [key]: value
    });
  });
};
