'use strict';

import Mn from 'backbone.marionette';

const template = require('./main.ejs');
const MenuView = require('./menu');

require('bootstrap');

module.exports = Mn.View.extend({
    template: template,
    modal:    null,

    ui: {
        main_region:  '#main',
        modal_region: '#modal-dialog'
    },

    regions: {
        main_region:  '@ui.main_region',
        modal_region: '@ui.modal_region',
        menu:         {
            el:             '#topmenu',
            replaceElement: true
        }
    },

    /**
     *
     * @param view
     * @param [show_callback]
     * @param [shown_callback]
     */
    showModalDialog: function (view, show_callback, shown_callback) {
        this.showChildView('modal_region', view);
        this.modal.modal('show');

        let ui = this;

        this.modal.on('hidden.bs.modal', function (/*e*/) {
            if (show_callback) {
                ui.modal.off('show.bs.modal', show_callback);
            }

            if (shown_callback) {
                ui.modal.off('shown.bs.modal', shown_callback);
            }

            ui.modal.off('hidden.bs.modal');
            view.destroy();
        });

        if (show_callback) {
            this.modal.on('show.bs.modal', show_callback);
        }

        if (shown_callback) {
            this.modal.on('shown.bs.modal', shown_callback);
        }

        this.modal.on('hidden.bs.modal', function () {
            console.log('HIDDEN CALLBACK HIT!! ');
        });
    },

    /**
     * @param [hidden_callback]
     */
    closeModal: function (hidden_callback) {
        if (this.modal) {
            if (hidden_callback) {
                this.modal.on('hidden.bs.modal', hidden_callback);
                setTimeout(function () {
                    this.modal.off('hidden.bs.modal', hidden_callback);
                }.bind(this), 1000);
            }

            this.modal.modal('hide');
        }
    },

    /**
     *
     */
    onRender: function () {
        this.showChildView('menu', new MenuView());

        if (this.modal === null) {
            this.modal = $('#modal-dialog');
            this.modal.modal({
                show: false
            });
        }
    }
});
