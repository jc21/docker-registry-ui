'use strict';

const _    = require('lodash');
const rest = require('restler');

/**
 *
 * @param   {String}   domain
 * @param   {Boolean}  use_ssl
 * @param   {String}   [username]
 * @param   {String}   [password]
 * @returns {module}
 */
module.exports = function (domain, use_ssl, username, password) {

    this._baseurl = 'http' + (use_ssl ? 's' : '') + '://' + (username ? username + ':' + password + '@' : '') + domain + '/v2/';

    /**
     * @param   {Integer}  [version]
     * @returns {Object}
     */
    this.getUrlOptions = function (version) {
        let options = {
            headers: {
                'User-Agent': 'Docker Registry UI'
            }
        };

        if (version === 2) {
            options.headers.Accept = 'application/vnd.docker.distribution.manifest.v2+json';
        }

        return options;
    };

    /**
     * @param   {Integer}  [limit]
     * @returns {Promise}
     */
    this.getImages = function (limit) {
        limit = limit || 300;

        return new Promise((resolve, reject) => {
            rest.get(this._baseurl + '_catalog?n=' + limit, this.getUrlOptions())
                .on('timeout', function (ms) {
                    reject(new Error('Request timed out after ' + ms + 'ms'));
                })
                .on('complete', function (result) {
                    if (result instanceof Error) {
                        reject(result);
                    } else {
                        resolve(result);
                    }
                });
        });
    };

    /**
     * @param   {String}   image
     * @param   {Integer}  [limit]
     * @returns {Promise}
     */
    this.getImageTags = function (image, limit) {
        limit = limit || 300;

        return new Promise((resolve, reject) => {
            rest.get(this._baseurl + image + '/tags/list?n=' + limit, this.getUrlOptions())
                .on('timeout', function (ms) {
                    reject(new Error('Request timed out after ' + ms + 'ms'));
                })
                .on('complete', function (result) {
                    if (result instanceof Error) {
                        reject(result);
                    } else {
                        resolve(result);
                    }
                });
        });
    };

    /**
     * @param   {String}  image
     * @param   {String}  digest
     * @returns {Promise}
     */
    this.deleteImage = function (image, digest) {
        return new Promise((resolve, reject) => {
            rest.del(this._baseurl + image + '/manifests/' + digest, this.getUrlOptions())
                .on('timeout', function (ms) {
                    reject(new Error('Request timed out after ' + ms + 'ms'));
                })
                .on('202', function () {
                    resolve(true);
                })
                .on('404', function () {
                    resolve(false);
                })
                .on('complete', function (result) {
                    if (result instanceof Error) {
                        reject(result);
                    } else {
                        if (typeof result.errors !== 'undefined' && result.errors.length) {
                            let err = result.errors.shift();
                            resolve(err);
                        }
                    }
                });
        });
    };

    /**
     * @param   {String}  image
     * @param   {String}  layer_digest
     * @returns {Promise}
     */
    this.deleteLayer = function (image, layer_digest) {
        return new Promise((resolve, reject) => {
            rest.del(this._baseurl + image + '/blobs/' + layer_digest, this.getUrlOptions())
                .on('timeout', function (ms) {
                    reject(new Error('Request timed out after ' + ms + 'ms'));
                })
                .on('202', function () {
                    resolve(true);
                })
                .on('404', function () {
                    resolve(false);
                })
                .on('complete', function (result) {
                    if (result instanceof Error) {
                        reject(result);
                    } else {
                        if (typeof result.errors !== 'undefined' && result.errors.length) {
                            let err = result.errors.shift();
                            resolve(err);
                        }
                    }
                });
        });
    };

    /**
     * @param   {String}   image
     * @param   {String}   reference     can be a tag or digest
     * @param   {Integer}  [version]     1 or 2, defaults to 1
     * @returns {Promise}
     */
    this.getManifest = function (image, reference, version) {
        version = version || 1;

        return new Promise((resolve, reject) => {
            rest.get(this._baseurl + image + '/manifests/' + reference, this.getUrlOptions(version))
                .on('timeout', function (ms) {
                    reject(new Error('Request timed out after ' + ms + 'ms'));
                })
                .on('complete', function (result, response) {
                    if (result instanceof Error) {
                        reject(result);
                    } else {
                        if (typeof result === 'string') {
                            result = JSON.parse(result);
                        }

                        result.digest = null;
                        if (typeof response.headers['docker-content-digest'] !== 'undefined') {
                            result.digest = response.headers['docker-content-digest'];
                        }

                        resolve(result);
                    }
                });
        });
    };

    return this;
};
