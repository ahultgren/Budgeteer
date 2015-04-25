'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var Omnium = require('../utils/omnium');

var entryTemplate = (entry) => {
  var value = entry.value; // parse expr
  var positive = value > 0 ? value : '';
  var negative = value < 0 ? -value : '';

  return `
    <tr>
      <td>${entry.date}</td>
      <td>${entry.category}</td>
      <td>${entry.text}</td>
      <td>${positive}</td>
      <td>${negative}</td>
    </tr>
  `;
};

var template = function ({entries}) {
  return `<div>
    <table class="table table-bordered table-hover">
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
      Total: ${R.sum(entries.map(R.prop('value')).map(Number))}
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
