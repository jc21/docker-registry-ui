'use strict';

import Mn from 'backbone.marionette';

const TagModel   = require('../../models/tag');
const Controller = require('../controller');
const Cache      = require('../cache');
const template   = require('./main.ejs');
const ErrorView  = require('../error/main');
const TagsView   = require('./tags/main');
const Api        = require('../api');

module.exports = Mn.View.extend({
    template: template,
    id:       'repo',
    fetching: false,
    error:    null,

    ui: {
        repos:       'a.repos-link',
        tags_region: 'div.tags-region',
        refresh:     '.refresh'
    },

    regions: {
        tags_region: '@ui.tags_region'
    },

    events: {
        'click @ui.repos-link': function (e) {
            e.preventDefault();
            Controller.showDashboard();
        },

        'click @ui.refresh': function (e) {
            e.preventDefault();
            this.ui.refresh.addClass('btn-loading').prop('disabled', true);
            this.fetchTags.bind(this)();
        }
    },

    templateContext: function () {
        let view = this;

        return {
            isFetching: function () {
                return view.fetching;
            }
        };
    },

    onRender: function () {
        if (this.error !== null) {
            this.showChildView('tags_region', new ErrorView({err: this.error}));
        } else if (!this.fetching) {
            this.showChildView('tags_region', new TagsView({
                collection: new TagModel.Collection(this.model.get('tags_data'))
            }));
        }
    },

    fetchTags: function () {
        this.fetching = true;
        let view = this;

        Api.Repos.get(this.model.get('name'), true)
            .then(response => {
                if (typeof response.tags !== 'undefined') {
                    view.model.set('tags_data', response.tags);
                } else {
                    view.error = new Error('Tags were not returned in response');
                }
            })
            .then(() => {
                view.fetching = false;
                view.render();
            })
            .catch(err => {
                view.fetching = false;
                view.error    = err;
                view.render();
            });
    },

    initialize: function (options) {
        if (typeof options.model === 'undefined') {
            if (typeof options.name === 'undefined') {
                this.error = new Error('Repo Name or Model was not given');
            } else {
                // Find the repo model in the cache, it should be there
                let model = Cache.Repos.find(function (model) {
                    return model.get('name') === options.name;
                });

                if (!model) {
                    this.error = new Error('Repo "' + options.name + '" does not exist');
                } else {
                    options.model = model;
                }
            }
        }

        if (this.error === null) {
            this.model = options.model;

            // Make sure model has tag data
            if (typeof this.model !== 'undefined' && !this.model.get('tags_data')) {
                // Let's fetch it
                this.fetchTags.bind(this)();
            }
        }
    }
});
