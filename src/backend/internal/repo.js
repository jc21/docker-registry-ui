'use strict';

const REGISTRY_HOST = process.env.REGISTRY_HOST;
const REGISTRY_SSL  = !!process.env.REGISTRY_SSL;

const _         = require('lodash');
const Docker    = require('../lib/docker-registry');
const batchflow = require('batchflow');
const registry  = new Docker(REGISTRY_HOST, REGISTRY_SSL);

const internalRepo = {

    /**
     * @param  {String}   name
     * @param  {Boolean}  full
     * @return {Promise}
     */
    get: (name, full) => {
        return registry.getImageTags(name)
            .then(tags_data => {
                if (full && tags_data.tags !== null) {
                    return new Promise((resolve, reject) => {
                        batchflow(tags_data.tags).parallel(2)
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
                                        console.error(err);
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
                if (typeof result.repositories !== 'undefined') {
                    let repositories = [];
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
                        batchflow(images).parallel(2)
                            .each((i, image, next) => {
                                let image_result = image;
                                // for each image
                                registry.getImageTags(image.name)
                                    .then(tags_result => {
                                        if (typeof tags_result === 'string') {
                                            // usually some sort of error
                                            console.error('Error: Tags result was: ', tags_result);
                                            image_result.tags = null;
                                        } else {
                                            image_result.tags = tags_result.tags;
                                        }

                                        next(image_result);
                                    })
                                    .catch(err => {
                                        console.error(err);
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
