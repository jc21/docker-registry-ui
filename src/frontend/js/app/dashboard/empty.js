'use strict';

import Mn from 'backbone.marionette';

module.exports = Mn.View.extend({
    template: function () {
        return '<div class="alert alert-secondary" role="alert">There are no images in this Registry yet. Read the <a href="#">pushing instructions</a> to get started.</div>';
    }
});
