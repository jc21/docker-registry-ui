'use strict';

const _    = require('lodash');
const util = require('util');

module.exports = {

    ItemNotFoundError: function (id, previous) {
        Error.captureStackTrace(this, this.constructor);
        this.name     = this.constructor.name;
        this.previous = previous;
        this.message  = 'Item Not Found - ' + id;
        this.public   = true;
        this.status   = 404;
    },

    RegistryError: function (code, message, previous) {
        Error.captureStackTrace(this, this.constructor);
        this.name     = this.constructor.name;
        this.previous = previous;
        this.message  = code + ': ' + message;
        this.public   = true;
        this.status   = 500;
    },

    InternalValidationError: function (message, previous) {
        Error.captureStackTrace(this, this.constructor);
        this.name     = this.constructor.name;
        this.previous = previous;
        this.message  = message;
        this.status   = 400;
        this.public   = false;
    },

    ValidationError: function (message, previous) {
        Error.captureStackTrace(this, this.constructor);
        this.name     = this.constructor.name;
        this.previous = previous;
        this.message  = message;
        this.public   = true;
        this.status   = 400;
    }
};

_.forEach(module.exports, function (error) {
    util.inherits(error, Error);
});
