'use strict';

const REGISTRY_HOST = process.env.REGISTRY_HOST;
const REGISTRY_SSL  = process.env.REGISTRY_SSL && process.env.REGISTRY_SSL.toLowerCase() === 'true' || parseInt(process.env.REGISTRY_SSL, 10) === 1;
const REGISTRY_USER = process.env.REGISTRY_USER;
const REGISTRY_PASS = process.env.REGISTRY_PASS;

const _         = require('lodash');
const Docker    = require('../lib/docker-registry');
const batchflow = require('batchflow');
const registry  = new Docker(REGISTRY_HOST, REGISTRY_SSL, REGISTRY_USER, REGISTRY_PASS);
const errors    = require('../lib/error');
const logger    = require('../logger').registry;

const internalRepo = {

    /**
     * @param  {String}   name
     * @param  {Boolean}  full
     * @return {Promise}
     */
    get: (name, full) => {
        return registry.getImageTags(name)
            .then(tags_data => {
                // detect errors
                if (typeof tags_data.errors !== 'undefined' && tags_data.errors.length) {
                    let top_err = tags_data.errors.shift();
                    if (top_err.code === 'NAME_UNKNOWN') {
                        throw new errors.ItemNotFoundError(name);
                    } else {
                        throw new errors.RegistryError(top_err.code, top_err.message);
                    }
                }

                if (full && tags_data.tags !== null) {
                    // Order the tags naturally, but put latest at the top if it exists
                    let latest_idx = tags_data.tags.indexOf('latest');
                    if (latest_idx !== -1) {
                        _.pullAt(tags_data.tags, [latest_idx]);
                    }

                    // sort
                    tags_data.tags = tags_data.tags.sort((a, b) => a.localeCompare(b));

                    if (latest_idx !== -1) {
                        tags_data.tags.unshift('latest');
                    }

                    return new Promise((resolve, reject) => {
                        batchflow(tags_data.tags).sequential()
                            .each((i, tag, next) => {
                                // for each tag, we want to get 2 manifests.
                                // Version 2 returns the layers and the correct image id
                                // Version 1 returns the history we want to pluck from
                                registry.getManifest(tags_data.name, tag, 2)
                                    .then(manifest2_result => {
                                        manifest2_result.name       = tag;
                                        manifest2_result.image_name = name;

                                        return registry.getManifest(tags_data.name, tag, 1)
                                            .then(manifest1_result => {
                                                manifest2_result.info = null;

                                                if (typeof manifest1_result.history !== 'undefined' && manifest1_result.history.length) {
                                                    let info = manifest1_result.history.shift();
                                                    if (typeof info.v1Compatibility !== undefined) {
                                                        info = JSON.parse(info.v1Compatibility);

                                                        // Remove cruft
                                                        if (typeof info.config !== 'undefined') {
                                                            delete info.config;
                                                        }

                                                        if (typeof info.container_config !== 'undefined') {
                                                            delete info.container_config;
                                                        }
                                                    }

                                                    manifest2_result.info = info;
                                                }

                                                next(manifest2_result);
                                            });
                                    })
                                    .catch(err => {
                                        logger.error(err);
                                        next(null);
                                    });
                            })
                            .error(err => {
                                reject(err);
                            })
                            .end(results => {
                                tags_data.tags = results || null;
                                resolve(tags_data);
                            });
                    });
                } else {
                    return tags_data;
                }
            });
    },

    /**
     * All repos
     *
     * @param   {Boolean}   [with_tags]
     * @returns {Promise}
     */
    getAll: with_tags => {
        return registry.getImages()
            .then(result => {
                if (typeof result.errors !== 'undefined' && result.errors.length) {
                    let first_err = result.errors.shift();
                    throw new errors.RegistryError(first_err.code, first_err.message);
                } else if (typeof result.repositories !== 'undefined') {
                    let repositories = [];

                    // sort images
                    result.repositories = result.repositories.sort((a, b) => a.localeCompare(b));

                    _.map(result.repositories, function (repo) {
                        repositories.push({
                            name: repo
                        });
                    });

                    return repositories;
                }

                return result;
            })
            .then(images => {
                if (with_tags) {
                    return new Promise((resolve, reject) => {
                        batchflow(images).sequential()
                            .each((i, image, next) => {
                                let image_result = image;
                                // for each image
                                registry.getImageTags(image.name)
                                    .then(tags_result => {
                                        if (typeof tags_result === 'string') {
                                            // usually some sort of error
                                            logger.error('Tags result was: ', tags_result);
                                            image_result.tags = null;
                                        } else if (typeof tags_result.tags !== 'undefined' && tags_result.tags !== null) {
                                            // Order the tags naturally, but put latest at the top if it exists
                                            let latest_idx = tags_result.tags.indexOf('latest');
                                            if (latest_idx !== -1) {
                                                _.pullAt(tags_result.tags, [latest_idx]);
                                            }

                                            // sort tags
                                            image_result.tags = tags_result.tags.sort((a, b) => a.localeCompare(b));

                                            if (latest_idx !== -1) {
                                                image_result.tags.unshift('latest');
                                            }
                                        }

                                        next(image_result);
                                    })
                                    .catch(err => {
                                        logger.error(err);
                                        image_result.tags = null;
                                        next(image_result);
                                    });
                            })
                            .error(err => {
                                reject(err);
                            })
                            .end(results => {
                                resolve(results);
                            });
                    });
                } else {
                    return images;
                }
            });
    },

    /**
     * Delete a image/tag
     *
     * @param   {String}   name
     * @param   {String}   digest
     * @returns {Promise}
     */
    delete: (name, digest) => {
        return registry.deleteImage(name, digest);
    }
};

module.exports = internalRepo;
