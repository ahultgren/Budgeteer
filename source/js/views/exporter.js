'use strict';

var saveAs = require('filesaver.js');

exports.init = (elem, {state}) => {
  elem.asEventStream('click', '.js-export')
  .doAction('.preventDefault')
  .onValue(() => {
    saveAs(new Blob([JSON.stringify(state.get())], {
      type: 'application/javascript;charset=utf-8'
    }), 'data.json');
  });
};
