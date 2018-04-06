'use strict';

import Backbone from 'backbone';

const model = Backbone.Model.extend({
    idAttribute: 'name',

    defaults: function () {
        return {
            tags: []
        };
    }
});

module.exports = {
    Model:      model,
    Collection: Backbone.Collection.extend({
        model:      model,
        comparator: function (model) {
            return model.get('name');
        }
    })
};
