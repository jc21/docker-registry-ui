'use strict';

import Mn from 'backbone.marionette';

const Controller = require('../controller');
const template   = require('./list-item.ejs');

module.exports = Mn.View.extend({
    template: template,
    tagName:  'tr',

    ui: {
        repo: 'a.repo-link'
    },

    events: {
        'click @ui.repo': function (e) {
            e.preventDefault();
            Controller.showRepo(this.model);
        }
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    }
});
