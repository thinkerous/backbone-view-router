module.exports = (function () {
    'use strict';

    var _ = require('underscore'),
        Backbone = require('backbone'),

        chai = require('chai').use(require('sinon-chai')),
        sinon = require('sinon');

    ////////////////////

    global.window = require('./window.js');

    _.extend(Backbone, require('../index.js'), {
        $: require('../lib/jquery/jquery.js')(window)
    });

    ////////////////////

    return {
        _: _,
        Backbone: Backbone,

        chai: chai,
        sinon: sinon
    };
}());
