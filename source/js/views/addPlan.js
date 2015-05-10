'use strict';

require('bootstrap/js/modal');

var Omnium = require('../utils/omnium');

var periods = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

var option = (text) => `<option value="${text}">${text}</option>`;

var modal = () => {
  return `
    <div class="js-add-plan-modal modal fade" tabindex="-1">
      <div class="modal-dialog">
        <form class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">New plan</h4>
          </div>
          <div class="modal-body">
            <div class="form form-horizontal">
              <div class="form-group">
                <label class="col-sm-4 control-label">Name</label>
                <div class="col-sm-6">
                  <input type="text" class="js-add-plan-name form-control" value="">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">Periods</label>
                <div class="col-sm-6">
                  <select type="text" class="js-add-plan-period form-control">
                    ${periods.map(option).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button class="btn btn-primary">Add plan</button>
          </div>
        </form>
      </div>
    </div>
  `;
};

var template = () => {
  return `
    <div>
      <button class="js-add btn btn-primary pull-right"><i class="glyphicon glyphicon-plus"></i></button>
      ${modal()}
    </div>
  `;
};

exports.init = (elem, _, actions) => {
  var render = Omnium.create({
    parent: elem.get(0),
    template
  });

  render();

  elem.asEventStream('click', '.js-add').onValue(() => {
    elem.find('.js-add-plan-modal').modal();
  });

  elem.asEventStream('submit')
  .doAction('.preventDefault')
  .onValue(() => {
    var numberOfPeriods = 6;
    var name = elem.find('.js-add-plan-name').val();
    var selectedPeriod = elem.find('.js-add-plan-period').val();
    var selectedPeriodIndex = periods.indexOf(selectedPeriod);
    // Loop the periods-array so we can take n periods from it with a slice
    var extendedPeriods = [...periods].concat(periods.slice(0, numberOfPeriods));
    var planPeriods = extendedPeriods.slice(selectedPeriodIndex, selectedPeriodIndex + numberOfPeriods);

    actions.addPeriod({
      name,
      periods: planPeriods
    });

    elem.find('.js-add-plan-modal').modal('hide');
    render();
  });
};
