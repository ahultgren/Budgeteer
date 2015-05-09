'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var Omnium = require('../utils/omnium');

var hasCategory = R.propEq('category');
var hasPeriod = R.propEq('period');
var spentInPeriod = (entries, category, period, summer) => entries
  .filter(hasCategory(category.name))
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
    .filter(hasCategory(category.name))
    .map(summer)
    .reduce(R.add, 0);

  return `
    <tr class="actions-row">
      <td>
        <div class="actions-box">
          <button class="js-remove btn btn-xs btn-danger" data-id="${category.id}"><i class="glyphicon glyphicon-minus"></i></button>
        </div>
        ${category.name}
      </td>
      ${periodResults}
      <td>${total}</td>
    </tr>
    <tr>
      <td>${category.budget}</td>
      ${periodBudgets}
      <td>${category.budget - total}</td>
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

  return `<td>${balance}</td>`;
};

var totalResultBalance = (entries) => {
  return entries.map(incMinusExp).reduce(R.add, 0);
};

var balance = (entries, periods) => {
  return `
    <tr>
      <td>Balance</td>
      ${periods.map(periodResultBalance(entries)).join('')}
      <td>${totalResultBalance(entries)}</td>
    </tr>
  `;
};

var template = ({periods, categories, entries}) => {
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
};
