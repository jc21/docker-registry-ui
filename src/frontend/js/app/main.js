'use strict';

import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';

const Mn         = require('../lib/marionette');
const Cache      = require('./cache');
const Controller = require('./controller');
const Router     = require('./router');
const UI         = require('./ui/main');
const Api        = require('./api');
const ErrorView  = require('./error/main');

const App = Mn.Application.extend({

    region:     '#app',
    Cache:      Cache,
    Api:        Api,
    UI:         null,
    Controller: Controller,
    version:    null,

    onStart: function (app, options) {
        console.log('Welcome to Docker Registry UI');

        // Check if the backend is up and running
        Api.status()
            .then(result => {
                this.version = [result.version.major, result.version.minor, result.version.revision].join('.');
                Cache.Config = result.config;
            })
            .then(this.bootstrap)
            .then(() => {
                this.bootstrapTimer();
                this.UI = new UI();
                this.UI.on('render', () => {
                    new Router(options);
                    Backbone.history.start({});
                    $('#app').removeClass('loading');
                });

                this.getRegion().show(this.UI);
            })
            .catch(err => {
                console.error(err);
                this.trigger('after:start');
                $('#app').removeClass('loading');
                this.getRegion().show(new ErrorView({err: err}));
            });
    },

    History: {
        replace: function (data) {
            window.history.replaceState(_.extend(window.history.state || {}, data), document.title);
        },

        get: function (attr) {
            return window.history.state ? window.history.state[attr] : undefined;
        }
    },

    Error: function (code, message, debug) {
        let temp     = Error.call(this, message);
        temp.name    = this.name = 'AppError';
        this.stack   = temp.stack;
        this.message = temp.message;
        this.code    = code;
        this.debug   = debug;
    },

    /**
     * Get user and other base info to start prime the cache and the application
     *
     * @returns {Promise}
     */
    bootstrap: function () {
        return Api.Repos.getAll(true)
            .then(response => {
                let clean_response = [];
                _.map(response, function(image) {
                    if (image.tags !== null && image.tags.length) {
                        clean_response.push(image);
                    }
                });

                Cache.Repos.set(clean_response);
            });
    },

    /**
     * Bootstraps the user from time to time
     */
    bootstrapTimer: function () {
        setTimeout(() => {
            Api.status()
                .then(result => {
                    let version = [result.version.major, result.version.minor, result.version.revision].join('.');
                    if (version !== this.version) {
                        document.location.reload();
                    } else {
                        Cache.Config = result.config;
                    }
                })
                .then(this.bootstrap)
                .then(() => {
                    this.bootstrapTimer();
                })
                .catch(err => {
                    if (err.message !== 'timeout' && err.code && err.code !== 400) {
                        console.error(err.message);
                    }

                    this.bootstrapTimer();
                });
        }, 120 * 1000); // 2 mins
    }
});

const app = new App();
module.exports = app;
