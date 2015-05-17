'use strict';

var Omnium = require('../utils/omnium');

var toggle = ((x = false) => () => x = !x)();

var link = () => {
  return `
    <a href="#" class="js-import-toggle"><i class="glyphicon glyphicon-open"></i> Import</a>
  `;
};

var input = () => {
  return `
    <input type="file" class="form-control js-import-file">
    <button class="btn btn-default js-import-toggle"><i class="glyphicon glyphicon-remove"></i></button>
  `;
};

var template = (showInput) => {
  return `
    <ul class="nav navbar-${showInput ? 'form' : 'nav'} navbar-right js-importer">
      <li>${showInput ? input() : link()}</li>
    </ul>
  `;
};

exports.init = (elem, state, actions) => {
  var render = Omnium.create({
    parent: elem.get(0),
    template
  });

  render();

  elem.asEventStream('click', '.js-import-toggle')
  .doAction('.preventDefault')
  .onValue(() => {
    render(toggle());
  });

  elem.asEventStream('change', '.js-import-file')
  .onValue((e) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      actions.loadAllData(JSON.parse(e.target.result));
      render(toggle());
    };
    reader.readAsText(e.target.files[0]);
  });
};
