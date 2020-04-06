'use strict';

const express      = require('express');
const validator    = require('../../lib/validator');
const pagination   = require('../../lib/express/pagination');
const internalRepo = require('../../internal/repo');

let router = express.Router({
    caseSensitive: true,
    strict:        true,
    mergeParams:   true
});

/**
 * /api/repos
 */
router
    .route('/')
    .options((req, res) => {
        res.sendStatus(204);
    })

    /**
     * GET /api/repos
     *
     * Retrieve all repos
     */
    .get(pagination('name', 0, 50, 300), (req, res, next) => {
        validator({
            additionalProperties: false,
            properties:           {
                tags: {
                    type: 'boolean'
                }
            }
        }, {
            tags: (typeof req.query.tags !== 'undefined' ? !!req.query.tags : false)
        })
            .then(data => {
                return internalRepo.getAll(data.tags);
            })
            .then(repos => {
                res.status(200)
                    .send(repos);
            })
            .catch(next);
    });

/**
 * Specific repo
 *
 * /api/repos/abc123
 */
router
    .route('/:name([-a-zA-Z0-9/.,_]+)')
    .options((req, res) => {
        res.sendStatus(204);
    })

    /**
     * GET /api/repos/abc123
     *
     * Retrieve a specific repo
     */
    .get((req, res, next) => {
        validator({
            required:             ['name'],
            additionalProperties: false,
            properties:           {
                name: {
                    type:      'string',
                    minLength: 1
                },
                full: {
                    type: 'boolean'
                }
            }
        }, {
            name: req.params.name,
            full: (typeof req.query.full !== 'undefined' ? !!req.query.full : false)
        })
            .then(data => {
                return internalRepo.get(data.name, data.full);
            })
            .then(repo => {
                res.status(200)
                    .send(repo);
            })
            .catch(next);
    })

    /**
     * DELETE /api/repos/abc123
     *
     * Delete a specific image/tag
     */
    .delete((req, res, next) => {
        validator({
            required:             ['name', 'digest'],
            additionalProperties: false,
            properties:           {
                name:   {
                    type:      'string',
                    minLength: 1
                },
                digest: {
                    type:      'string',
                    minLength: 1
                }
            }
        }, {
            name:   req.params.name,
            digest: (typeof req.query.digest !== 'undefined' ? req.query.digest : '')
        })
            .then(data => {
                return internalRepo.delete(data.name, data.digest);
            })
            .then(result => {
                res.status(200)
                    .send(result);
            })
            .catch(next);
    });
module.exports = router;
