'use strict';

const express = require('express');
const fs      = require('fs');

const router = express.Router({
    caseSensitive: true,
    strict:        true,
    mergeParams:   true
});

/**
 * GET .*
 */
router.get(/(.*)/, function (req, res, next) {
    req.params.page = req.params['0'];
    if (req.params.page === '/') {
        req.params.page = '/index.html';
    }

    fs.readFile('dist' + req.params.page, 'utf8', function(err, data) {
        if (err) {
            if (req.params.page !== '/index.html') {
                fs.readFile('dist/index.html', 'utf8', function(err2, data) {
                    if (err2) {
                        next(err);
                    } else {
                        res.contentType('text/html').end(data);
                    }
                });
            } else {
                next(err);
            }
        } else {
            res.contentType('text/html').end(data);
        }
    });
});

module.exports = router;
