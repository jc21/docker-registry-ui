'use strict';

const express = require('express');
const pjson   = require('../../../../package.json');

let router = express.Router({
    caseSensitive: true,
    strict:        true,
    mergeParams:   true
});

/**
 * Health Check
 * GET /api
 */
router.get('/', (req, res/*, next*/) => {
    let version = pjson.version.split('-').shift().split('.');

    res.status(200).send({
        status:  'OK',
        version: {
            major:    parseInt(version.shift(), 10),
            minor:    parseInt(version.shift(), 10),
            revision: parseInt(version.shift(), 10)
        },
        config:  {
            REGISTRY_STORAGE_DELETE_ENABLED: process.env.REGISTRY_STORAGE_DELETE_ENABLED && process.env.REGISTRY_STORAGE_DELETE_ENABLED.toLowerCase() === 'true' || parseInt(process.env.REGISTRY_STORAGE_DELETE_ENABLED, 10) === 1,
            REGISTRY_DOMAIN:                 process.env.REGISTRY_DOMAIN || null
        }
    });
});

router.use('/repos', require('./repos'));

module.exports = router;
