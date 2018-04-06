#!/usr/bin/env node

'use strict';

const config       = require('config');
const app          = require('./app');
const logger       = require('./logger');
const apiValidator = require('./lib/validator/api');

let port = process.env.PORT || 80;

if (config.has('port')) {
    port = config.get('port');
}

if (!process.env.REGISTRY_HOST) {
    console.error('Error: REGISTRY_HOST environment variable was not found!');
    process.exit(1);
}

apiValidator.loadSchemas
    .then(() => {
        const server = app.listen(port, () => {
            logger.info('PID ' + process.pid + ' listening on port ' + port + ' ...');
            logger.info('Registry Host: ' + process.env.REGISTRY_HOST);

            process.on('SIGTERM', () => {
                logger.info('PID ' + process.pid + ' received SIGTERM');
                server.close(() => {
                    logger.info('Stopping.');
                    process.exit(0);
                });
            });
        });
    })
    .catch(err => {
        logger.error(err);
        process.exit(1);
    });
