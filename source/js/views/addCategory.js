'use strict';

var Omnium = require('../utils/omnium');

var template = ({name = '', budget = ''} = {}) => { // jshint ignore:line
  return `
    <form class="form-inline">
      <select type="text" class="js-category-type form-control col-sm-3">
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input type="text" class="js-category-name form-control col-sm-3" placeholder="Name" value="${name}">
      <input type="number" class="js-category-budget form-control col-sm-3" placeholder="Budget" value="${budget}">
      <button class="btn btn-primary col-sm-3"><i class="glyphicon glyphicon-plus"></i> Add Category</button>
    </form>
  `;
};

exports.init = (elem, state, actions) => {
  var render = Omnium.create({
    parent: elem.get(0),
    template
  });

  render();

  elem.asEventStream('submit')
  .doAction('.preventDefault')
  .map(() => ({
    type: elem.find('.js-category-type').val(),
    name: elem.find('.js-category-name').val(),
    budget: elem.find('.js-category-budget').val(),
  }))
  .doAction(actions.addCategory)
  .onValue(render);
};
