'use strict';

const Mn         = require('../lib/marionette');
const Controller = require('./controller');

module.exports = Mn.AppRouter.extend({
    appRoutes: {
        'repo/:name':            'showRepo',
        'instructions/pushing':  'showPushingInstructions',
        'instructions/pulling':  'showPullingInstructions',
        'instructions/deletion': 'showDeletionInstructions',
        '*default':              'showDashboard'
    },

    initialize: function () {
        this.controller = Controller;
    }
});
