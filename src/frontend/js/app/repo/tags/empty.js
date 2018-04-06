'use strict';

import Mn from 'backbone.marionette';

module.exports = Mn.View.extend({
    template: function () {
        return '<div class="alert alert-warning" role="alert">There are no tags in this repository.</div>';
    }
});
