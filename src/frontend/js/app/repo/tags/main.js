'use strict';

import Mn from 'backbone.marionette';

const template  = require('./main.ejs');
const EmptyView = require('./empty');
const ItemView  = require('./list-item');

const ListView = Mn.CollectionView.extend({
    childView: ItemView
});

module.exports = Mn.View.extend({
    template: template,

    ui: {
        list_region: 'div.tags-list-region'
    },

    regions: {
        list_region: '@ui.list_region'
    },

    onRender: function () {
        if (this.collection.length) {
            this.collection.sort();
            this.showChildView('list_region', new ListView({
                collection: this.collection
            }));
        } else {
            this.showChildView('list_region', new EmptyView());
        }
    }
});
