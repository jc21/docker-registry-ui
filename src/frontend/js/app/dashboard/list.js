'use strict';

import Mn from 'backbone.marionette';

const template = require('./list.ejs');
const ItemView = require('./list-item');

const TableBody = Mn.CollectionView.extend({
    tagName:   'tbody',
    childView: ItemView
});

module.exports = Mn.View.extend({
    tagName:   'table',
    className: 'table',
    template:  template,

    regions: {
        body: {
            el:             'tbody',
            replaceElement: true
        }
    },

    onRender: function () {
        this.showChildView('body', new TableBody({
            collection: this.collection
        }));
    },

    initialize: function (options) {
        options.collection.sort();
    }
});
