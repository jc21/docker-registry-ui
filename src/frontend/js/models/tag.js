'use strict';

import Backbone from 'backbone';

const model = Backbone.Model.extend({
    idAttribute: 'name',

    defaults: function () {
        return {
            name:   '',
            digest: '',
            config: {},
            info:   {},
            layers: []
        };
    }
});

module.exports = {
    Model:      model,
    Collection: Backbone.Collection.extend({
        model: model,
        comparator: function (model) {
            return model.get('name');
        }
    })
};
