'use strict';

import Mn from 'backbone.marionette';

const _        = require('underscore');
const moment   = require('moment');
const template = require('./list-item.ejs');
const App      = require('../../main');

require('@bassettsj/livestamp');

module.exports = Mn.View.extend({
    template:  template,
    className: 'card',

    ui: {
        created:            '.created',
        delete:             '.delete-link',
        delete_real:        '.delete-real',
        delete_confirm:     '.delete-confirm',
        pull_command:       '.pull-command',
        delete_unsupported: '.delete-unsupported',
        deletion_link:      '.deletion-link'
    },

    events: {
        'click @ui.deletion_link': function (e) {
            e.preventDefault();
            App.Controller.showDeletionInstructions();
        },

        'click @ui.delete': function (e) {
            e.preventDefault();
            this.ui.delete_confirm.toggle();
            this.ui.pull_command.toggle();
        },

        'click @ui.delete_real': function (e) {
            e.preventDefault();
            let view = this;

            this.ui.delete_real.addClass('btn-loading').prop('disabled', true);

            App.Api.Repos.delete(this.model.get('image_name'), this.model.get('digest'))
                .then(response => {
                    if (typeof response.code !== 'undefined' && response.code === 'UNSUPPORTED') {
                        view.ui.delete_confirm.toggle();
                        view.ui.delete_unsupported.toggle();
                        view.ui.delete_real.removeClass('btn-loading').prop('disabled', false);
                    } else if (response) {
                        return App.bootstrap()
                            .then(() => {
                                App.Controller.showDashboard();
                            });
                    } else {
                        view.ui.delete_real.removeClass('btn-loading').prop('disabled', false);
                        alert('Unable to delete the image. Does it still exist?');
                    }
                })
                .catch(err => {
                    alert(err.message);
                    this.ui.delete_real.removeClass('btn-loading').prop('disabled', false);
                });
        }
    },

    templateContext: function () {
        let model = this.model;

        return {
            getSize: function () {
                let layers = model.get('layers');

                if (layers) {
                    let size = 0;
                    _.map(layers, function (layer) {
                        size += layer.size;
                    });

                    // to mb
                    size = size / 1024 / 1024;

                    return size.toFixed(0) + ' mb';
                }

                return 'Unknown';
            }
        };
    },

    onRender: function () {
        let created = moment(this.model.get('info').created);
        this.ui.created.attr('title', created.format('YYYY-MM-DD HH:mm')).livestamp(created);
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    }
});
