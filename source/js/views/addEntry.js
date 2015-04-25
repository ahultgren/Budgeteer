'use strict';

var Bacon = require('baconjs');
var Omnium = require('../utils/omnium');

var categorySelect = (categories) => {
  var options = categories.map((category) => {
    return `<option value="${category}">${category}</option>`;
  }).join('');

  return `
    <select class="js-entry-category">
      ${options}
    </select>
  `;
};

var periodSelect = (periods) => {
  var options = periods.map((period) => {
    return `<option value="${period}">${period}</option>`;
  }).join('');

  return `
    <select class="js-entry-period">
      ${options}
    </select>
  `;
};

var template = function ({categories, periods}) {
  return `
    <div>
      ${periodSelect(periods)}
      <input type="date" class="js-entry-date" value="">
      <input type="text" class="js-entry-text" value="">
      ${categorySelect(categories)}
      <input type="number" class="js-entry-value" value="">
      <button type="button" class="js-entry-add" value="">Add</button>
    </div>
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

  elem.asEventStream('click', '.js-entry-add')
  .map(() => ({
    date: elem.find('.js-entry-date').val(),
    description: elem.find('.js-entry-text').val(),
    category: elem.find('.js-entry-category').val(),
    value: elem.find('.js-entry-value').val(),
    period: elem.find('.js-entry-period').val(),
  }))
  .onValue((data) => {
    entries.push(data);
    //render();
  });

  Bacon.combineTemplate({
    categories: categories.asProperty(),
    periods: periods.asProperty(),
  })
  .onValue(render);
};
