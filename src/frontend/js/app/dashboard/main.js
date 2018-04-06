'use strict';

import Mn from 'backbone.marionette';

const Cache     = require('../cache');
const template  = require('./main.ejs');
const ListView  = require('./list');
const EmptyView = require('./empty');

module.exports = Mn.View.extend({
    template: template,
    id:       'dashboard',

    ui: {
        list_region: 'div.list-region'
    },

    regions: {
        list_region: '@ui.list_region'
    },

    onRender: function () {
        if (Cache.Repos && Cache.Repos.length) {
            this.showChildView('list_region', new ListView({
                collection: Cache.Repos
            }));
        } else {
            this.showChildView('list_region', new EmptyView());
        }
    }
});
