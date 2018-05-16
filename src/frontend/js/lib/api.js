import $ from 'jquery';

/**
 * @param {String}  message
 * @param {*}       debug
 * @param {Integer} [code]
 * @constructor
 */
const ApiError = function (message, debug, code) {
    let temp  = Error.call(this, message);
    temp.name = this.name = 'ApiError';
    this.stack   = temp.stack;
    this.message = temp.message;
    this.debug   = debug;
    this.code    = code;
};

ApiError.prototype = Object.create(Error.prototype, {
    constructor: {
        value:        ApiError,
        writable:     true,
        configurable: true
    }
});

/**
 *
 * @param   {String} verb
 * @param   {String} path
 * @param   {Object} [data]
 * @param   {Object} [options]
 * @returns {Promise}
 */
function fetch (verb, path, data, options) {
    options = options || {};

    return new Promise(function (resolve, reject) {
        let api_url = '/api/';
        let url     = api_url + path;

        $.ajax({
            url:         url,
            data:        typeof data === 'object' ? JSON.stringify(data) : data,
            type:        verb,
            dataType:    'json',
            contentType: 'application/json; charset=UTF-8',
            crossDomain: true,
            timeout:     (options.timeout ? options.timeout : 15000),
            xhrFields:   {
                withCredentials: true
            },

            success: function (data, textStatus, response) {
                let total = response.getResponseHeader('X-Dataset-Total');
                if (total !== null) {
                    resolve({
                        data:       data,
                        pagination: {
                            total:  parseInt(total, 10),
                            offset: parseInt(response.getResponseHeader('X-Dataset-Offset'), 10),
                            limit:  parseInt(response.getResponseHeader('X-Dataset-Limit'), 10)
                        }
                    });
                } else {
                    resolve(response);
                }
            },

            error: function (xhr, status, error_thrown) {
                let code = 400;

                if (typeof xhr.responseJSON !== 'undefined' && typeof xhr.responseJSON.error !== 'undefined' && typeof xhr.responseJSON.error.message !== 'undefined') {
                    error_thrown = xhr.responseJSON.error.message;
                    code         = xhr.responseJSON.error.code || 500;
                }

                reject(new ApiError(error_thrown, xhr.responseText, code));
            }
        });
    });
}

export default {
    status: function () {
        return fetch('get', '');
    },

    Repos: {
        /**
         * @param   {Boolean}  [with_tags]
         * @returns {Promise}
         */
        getAll: function (with_tags) {
            return fetch('get', 'repos' + (with_tags ? '?tags=1' : ''));
        },

        /**
         * @param   {String}  name
         * @param   {Boolean} [full]
         * @returns {Promise}
         */
        get: function (name, full) {
            return fetch('get', 'repos/' + name + (full ? '?full=1' : ''));
        },

        /**
         * @param   {String}  name
         * @param   {String} [digest]
         * @returns {Promise}
         */
        delete: function (name, digest) {
            return fetch('delete', 'repos/' + name + '?digest=' + digest);
        }
    }
};
