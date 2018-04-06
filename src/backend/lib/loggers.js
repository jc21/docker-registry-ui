'use strict';

const winston        = require('winston');
const expressWinston = require('express-winston');

winston.loggers.add('test', {
    console: {
        level: 'verbose',
        colorize: true
    }
});

winston.loggers.add('development', {
    console: {
        level: 'silly',
        colorize: true
    }
});

winston.loggers.add('production', {
    console: {
        level: 'info',
        colorize: true
    }
});

let winstance = winston.loggers.get(process.env.NODE_ENV);

module.exports = {
    http: expressWinston.logger({
        level: 'info',
        statusLevels: true,
        meta: false,
        winstonInstance: winstance,
        msg: [
                   '{{req.ip || req.connection.remoteAddress || "-"}}',
                   '[{{new Date().toJSON() || "-"}}]',
                   '"{{req.method}} {{req.originalUrl || req.url}} HTTP/{{req.httpVersion}}"',
                   '{{res.statusCode || "-"}}',
                   '{{res._headers && res._headers["content-length"] || "-"}}',
                   '"{{req.headers.referer || req.headers.referrer || "-"}}"',
                   '"{{req.headers["user-agent"] || "-"}}"',
                   '{{res.responseTime >= 0 ? res.responseTime + "ms" : "-"}}',
                   '{{req.headers && req.headers["x-api-version"] || "-"}}',
                   '{{res.locals.error_id || "-" }}'
               ].join(' '),
        colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
        ignoredRoutes: ['/robots.txt', '/sitemap.xml', '/favicon.ico', /\/assets.*/im],
        ignoreRoute: function (req/*, res*/) {
            return !!req.url.match(/^\/assets.*/im);
        }
    }),
    error: expressWinston.errorLogger({
        winstonInstance: winstance,
        dumpExceptions: true,
        showStack: true
    }),
    default: winstance
};
