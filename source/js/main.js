'use strict';

var state = require('./state');
var localstate = require('./modules/localstate');

var ledger = require('./views/ledger');
var addEntry = require('./views/addEntry');

localstate.load('state', state);
localstate.sync('state', state);

ledger.init($('.js-ledger'), state);
addEntry.init($('.js-add-entry'), state);
