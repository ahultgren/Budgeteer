'use strict';

var Omnium = require('../utils/omnium');

var template = function () {
  return `
    <div>
      <input type="date" class="js-entry-date" value="">
      <input type="text" class="js-entry-text" value="">
      <select class="js-entry-category"></select>
      <input type="number" class="js-entry-value" value="">
      <button type="button" class="js-entry-add" value="">Add</button>
    </div>
  `;
};

exports.init = function (elem, state) {
  var entries = state.select('entries');
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
  }))
  .onValue((data) => {
    entries.push(data);
    //render();
  });

  render();
};
