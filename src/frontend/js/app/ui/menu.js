'use strict';

import Mn from 'backbone.marionette';

const Controller = require('../controller');
const template   = require('./menu.ejs');

module.exports = Mn.View.extend({
    template:  template,
    id:        'topmenu',
    className: 'row align-items-center',

    ui: {
        links: 'a'
    },

    events: {
        'click @ui.links': function (e) {
            e.preventDefault();
            let href = e.target.href.replace(/[^#]*#/g, '');

            switch (href) {
                case 'dashboard':
                    Controller.showDashboard();
                    break;

                case 'instructions/pulling':
                    Controller.showPullingInstructions();
                    break;

                case 'instructions/pushing':
                    Controller.showPushingInstructions();
                    break;

                case 'instructions/deletion':
                    Controller.showDeletionInstructions();
                    break;
            }
        }
    }
});
