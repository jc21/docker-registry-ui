'use strict';

const moment = require('moment');
const _      = require('lodash');

module.exports = {

    /**
     * Takes an expression such as 30d and returns a moment object of that date in future
     *
     * Key      Shorthand
     * ==================
     * years         y
     * quarters      Q
     * months        M
     * weeks         w
     * days          d
     * hours         h
     * minutes       m
     * seconds       s
     * milliseconds  ms
     *
     * @param {String}  expression
     * @returns {Object}
     */
    parseDatePeriod: function (expression) {
        let matches = expression.match(/^([0-9]+)(y|Q|M|w|d|h|m|s|ms)$/m);
        if (matches) {
            return moment().add(matches[1], matches[2]);
        }

        return null;
    },

    /**
     * This will return an object that has the defaults supplied applied to it
     * if they didn't exist already.
     *
     * @param  {Object} obj
     * @param  {Object} defaults
     * @return {Object}
     */
    applyObjectDefaults: function (obj, defaults) {
        return _.assign({}, defaults, obj);
    },

    /**
     * Returns a random integer between min (included) and max (excluded)
     * Using Math.round() will give you a non-uniform distribution!
     *
     * @param   {Integer} min
     * @param   {Integer} max
     * @returns {Integer}
     */
    getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * Removes any fields with . joins in them, to avoid table joining select exposure
     * Also makes sure an 'id' field exists
     *
     * @param   {Array} fields
     * @returns {Array}
     */
    sanitizeFields: function (fields) {
        if (fields.indexOf('id') === -1) {
            fields.unshift('id');
        }

        let sanitized = [];
        for (let x = 0; x < fields.length; x++) {
            if (fields[x].indexOf('.') === -1) {
                sanitized.push(fields[x]);
            }
        }

        return sanitized;
    },

    /**
     *
     * @param   {String} input
     * @param   {String} [allowed]
     * @returns {String}
     */
    stripHtml: function (input, allowed) {
        allowed                = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

        let tags               = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        let commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

        return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    },

    /**
     *
     * @param   {String} text
     * @returns {String}
     */
    stripJiraMarkup: function (text) {
        return text.replace(/(?:^|[^{]{)[^}]+}/gi, "\n");
    },

    /**
     * @param   {String} content
     * @returns {String}
     */
    compactWhitespace: function (content) {
        return content
            .replace(/(\r|\n)+/gim, ' ')
            .replace(/ +/gim, ' ');
    },

    /**
     * @param   {String}  content
     * @param   {Integer} length
     * @returns {String}
     */
    trimString: function (content, length) {
        if (content.length > (length - 3)) {
            //trim the string to the maximum length
            let trimmed = content.substr(0, length - 3);

            //re-trim if we are in the middle of a word
            return trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' '))) + '...';
        }

        return content;
    },

    /**
     * @param   {String}  str
     * @returns {String}
     */
    ucwords: function (str) {
        return (str + '')
            .replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase()
            })
    },

    niceVarName: function (name) {
        return name.replace('_', ' ')
            .replace(/^(.)|\s+(.)/g, function ($1) {
                return $1.toUpperCase();
            });
    }

};
