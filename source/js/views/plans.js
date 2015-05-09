'use strict';

var Bacon = require('baconjs');
var R = require('ramda');
var Omnium = require('../utils/omnium');

var tab = R.curry((currentPlanId, plan) => {
  var active = currentPlanId === plan.id ? 'active' : '';

  return `
    <li class="${active}">
      <a href="#/${plan.id}">${plan.name}</a>
    </li>
  `;
});

var template = ({currentPlanId, plans}) => {
  return `
    <ul class="nav nav-tabs">
      ${plans.map(tab(currentPlanId)).join('')}
    </ul>
  `;
};

exports.init = (elem, {currentPlanId, plans}, actions) => {
  var render = Omnium.create({
    parent: elem.get(0),
    template
  });

  Bacon.combineTemplate({
    currentPlanId: currentPlanId.asProperty(),
    plans: plans.asProperty(),
  })
  .onValue(render);

  //## use onhashchange routing?
  elem.asEventStream('click', 'a')
  .doAction('.preventDefault')
  .map('.currentTarget').map($)
  .onValue((link) => {
    actions.updateCurrentPlan(link.attr('href').substring(2));
  });
};
