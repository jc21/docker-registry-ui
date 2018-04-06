'use strict';

import Backbone from 'backbone';

module.exports = {

    /**
     * @param {String} route
     * @param {Object} [options]
     * @returns {Boolean}
     */
    navigate: function (route, options) {
        options = options || {};
        Backbone.history.navigate(route.toString(), options);
        return true;
    },

    /**
     * Dashboard
     */
    showDashboard: function () {
        require(['./main', './dashboard/main'], (App, View) => {
            this.navigate('/');
            App.UI.showChildView('main_region', new View());
        });
    },

    /**
     * Repo
     *
     * @param {String|Model}  name_or_model
     */
    showRepo: function (name_or_model) {
        require(['./main', './repo/main'], (App, View) => {
            let options = {};
            if (typeof name_or_model === 'string') {
                options.name = name_or_model;
                this.navigate('/repo/' + name_or_model);
            } else {
                options.model = name_or_model;
                this.navigate('/repo/' + name_or_model.get('name'));
            }

            App.UI.showChildView('main_region', new View(options));
        });
    },

    /**
     * Deletion Instructions
     */
    showDeletionInstructions: function () {
        require(['./main', './instructions/deletion'], (App, View) => {
            this.navigate('/instructions/deletion');
            App.UI.showChildView('main_region', new View());
        });
    },

    /**
     * Pushing Instructions
     */
    showPushingInstructions: function () {
        require(['./main', './instructions/pushing'], (App, View) => {
            this.navigate('/instructions/pushing');
            App.UI.showChildView('main_region', new View());
        });
    },

    /**
     * Pulling Instructions
     */
    showPullingInstructions: function () {
        require(['./main', './instructions/pulling'], (App, View) => {
            this.navigate('/instructions/pulling');
            App.UI.showChildView('main_region', new View());
        });
    }
};
