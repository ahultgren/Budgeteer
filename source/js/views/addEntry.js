'use strict';

var Bacon = require('baconjs');
var uuid = require('uuid');
var Omnium = require('../utils/omnium');

var categorySelect = (categories) => {
  var options = categories.map((category) => {
    return `<option value="${category.name}">${category.name}</option>`;
  }).join('');

  return `
    <select class="js-entry-category form-control">
      ${options}
    </select>
  `;
};

var periodSelect = (periods) => {
  var options = periods.map((period) => {
    return `<option value="${period}">${period}</option>`;
  }).join('');

  return `
    <select class="js-entry-period form-control">
      ${options}
    </select>
  `;
};

var template = function ({categories, periods}) {
  return `
    <form class="form-inline">
      ${periodSelect(periods)}
      ${categorySelect(categories)}
      <input type="text" class="js-entry-text form-control" value="" placeholder="Description">
      <input type="number" class="js-entry-expense form-control" value="" placeholder="Expense">
      <input type="number" class="js-entry-income form-control" value="" placeholder="Income">
      <button class="js-entry-add form-control btn btn-primary" value="">Add</button>
    </form>
  `;
};

exports.init = function (elem, state) {
  var entries = state.select('entries');
  var categories = state.select('categories');
  var periods = state.select('periods');

  var render = Omnium.create({
    template,
    parent: elem.get(0)
  });

  var adds = elem.asEventStream('submit')
  .map(() => ({
    description: elem.find('.js-entry-text').val(),
    category: elem.find('.js-entry-category').val(),
    expense: elem.find('.js-entry-expense').val(),
    income: elem.find('.js-entry-income').val(),
    period: elem.find('.js-entry-period').val(),
    id: uuid.v4(),
  }));

  adds.onValue((data) => {
    entries.push(data);
  });

  Bacon.combineTemplate({
    categories: categories.asProperty(),
    periods: periods.asProperty(),
    clearFields: adds.toProperty('noop'),
  })
  .onValue(render);
};
