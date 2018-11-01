#!/usr/bin/env node

'use strict';

const logger = require('./logger').global;
const config = require('config');

let port = process.env.PORT || 80;

if (config.has('port')) {
    port = config.get('port');
}

if (!process.env.REGISTRY_HOST) {
    logger.error('Error: REGISTRY_HOST environment variable was not found!');
    process.exit(1);
}

function appStart () {

    const app          = require('./app');
    const apiValidator = require('./lib/validator/api');

    return apiValidator.loadSchemas
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
            logger.error(err.message);
            setTimeout(appStart, 1000);
        });
}

try {
    appStart();
} catch (err) {
    logger.error(err.message, err);
    process.exit(1);
}
