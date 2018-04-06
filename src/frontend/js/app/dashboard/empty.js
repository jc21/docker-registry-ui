'use strict';

import Mn from 'backbone.marionette';

const Controller = require('../controller');

module.exports = Mn.View.extend({
    template: function () {
        return '<div class="alert alert-secondary" role="alert">There are no images in this Registry yet. Read the <a href="#" class="pushing-link">pushing instructions</a> to get started.</div>';
    },

    ui: {
        pushing: '.pushing-link'
    },

    events: {
        'click @ui.pushing': function (e) {
            e.preventDefault();
            Controller.showPushingInstructions();
        }
    }
});
