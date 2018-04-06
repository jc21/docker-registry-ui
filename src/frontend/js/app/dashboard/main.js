'use strict';

import Mn from 'backbone.marionette';

const App       = require('../main');
const template  = require('./main.ejs');
const ListView  = require('./list');
const EmptyView = require('./empty');

module.exports = Mn.View.extend({
    template: template,
    id:       'dashboard',

    ui: {
        list_region: 'div.list-region',
        refresh:     '.refresh'
    },

    regions: {
        list_region: '@ui.list_region'
    },

    events: {
        'click @ui.refresh': function (e) {
            e.preventDefault();
            this.ui.refresh.addClass('btn-loading').prop('disabled', true);

            App.bootstrap()
                .then(() => {
                    this.render();
                })
                .catch(() => {
                    this.ui.refresh.removeClass('btn-loading').prop('disabled', false);
                });
        }
    },

    onRender: function () {
        if (App.Cache.Repos && App.Cache.Repos.length) {
            this.showChildView('list_region', new ListView({
                collection: App.Cache.Repos
            }));
        } else {
            this.showChildView('list_region', new EmptyView());
        }
    }
});
