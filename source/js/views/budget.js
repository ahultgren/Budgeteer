'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var Omnium = require('../utils/omnium');

var hasCategory = R.propEq('category');
var hasPeriod = R.propEq('period');

var periodHeader = (period) => {
  return `<th>${period}</th>`;
};

var categoryRow = (periods, entries) => (category) => {
  var periodResults = periods.map((period) => {
    return `
      <td>${entries
        .filter(hasCategory(category))
        .filter(hasPeriod(period))
        .map(R.prop('value'))
        .map(Number)
        .reduce(R.add, 0)}
      </td>
    `;
  }).join('');

  return `
    <tr>
      <td>${category}</td>
      ${periodResults}
    </tr>
  `;
};

var template = ({periods, categories, entries}) => {
  return `
    <table class="table table-striped">
      <caption>Budget and result</caption>
      <thead>
        <tr>
          <th>Categories</th>
          ${periods.map(periodHeader).join('')}
        </tr>
      </thead>
      <tbody>
        ${categories.map(categoryRow(periods, entries)).join('')}
      </tbody>
    </table>
  `;
};

exports.init = (elem, state) => {
  var periods = state.select('periods');
  var categories = state.select('categories');
  var entries = state.select('entries');

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
};
