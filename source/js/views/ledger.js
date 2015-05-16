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

var categorySelect = (categories, current, classnames = 'editable') => {
  return `
    <select class="${classnames} form-control input-sm" data-field="category">
      ${categories.map(categoryOption(current)).join('')}
    </select>
  `;
};

var entryTemplate = R.curry((categories, entry) => {
  return `
    <tr class="actions-row" data-id="${entry.id}">
      <td>
        <div class="actions-box">
          <button type="button" class="js-remove btn btn-xs btn-danger" data-id="${entry.id}"><i class="glyphicon glyphicon-minus"></i></button>
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

var addEntry = (period, categories) => {
  return `
    <tr class="actions-row">
      <td>
        <button class="hidden"></button>
        <input type="hidden" class="js-add-entry-period" value="${period}">
        <div class="actions-box">
          <button class="btn btn-xs btn-primary"><i class="glyphicon glyphicon-plus"></i></button>
        </div>
        ${categorySelect(categories, '', 'js-add-entry-category')}
      </td>
      <td>
        <input type="text" class="js-add-entry-text form-control input-sm" value="" placeholder="Description">
      </td>
      <td>
        <input type="number" class="js-add-entry-expense form-control input-sm" value="" placeholder="Expense">
      </td>
      <td>
        <input type="number" class="js-add-entry-income form-control input-sm" value="" placeholder="Income">
      </td>
    </tr>
  `;
};

var table = (period, entries, categories) => {
  var result = R.sum(entries.map(incMinusExp).map(Number));
  var negative = result < 0 ? 'u-negative' : '';

  return `<form>
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
      <tfoot>
        ${addEntry(period, categories)}
      </tfoot>
    </table>
    <p>
      Result: <span class="${negative}">${result}</span>
    </p>
  </form>`;
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

    if(id) {
      actions.updateEntry(id, {
        [key]: value
      });
    }
  });

  elem.asEventStream('keypress', '.editable').onValue((e) => {
    if(e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      //## Move focus to the field below
    }
  });

  elem.asEventStream('submit', 'form')
  .doAction('.preventDefault')
  .map('.target').map($)
  .map((form) => {
    var entry = {
      period: form.find('.js-add-entry-period').val(),
      category: form.find('.js-add-entry-category').val(),
      description: form.find('.js-add-entry-text').val(),
      expense: form.find('.js-add-entry-expense').val(),
      income: form.find('.js-add-entry-income').val(),
    };

    return entry;
  })
  .onValue(actions.addEntry);
};
