'use strict';

import _ from 'underscore';
import Mn from 'backbone.marionette';
import moment from 'moment';
import numeral from 'numeral';

const Cache = require('../app/cache');

let render         = Mn.Renderer.render;
Mn.Renderer.render = function (template, data, view) {

    data = _.clone(data);

    /**
     * @returns {String}
     */
    data.getVersion = function () {
        return VERSION;
    };

    /**
     * @param   {Integer} number
     * @returns {String}
     */
    data.niceNumber = function (number) {
        return numeral(number).format('0,0');
    };

    /**
     * @param   {Integer} seconds
     * @returns {String}
     */
    data.secondsToTime = function (seconds) {
        let sec_num = parseInt(seconds, 10);
        let minutes = Math.floor(sec_num / 60);
        let sec     = sec_num - (minutes * 60);

        if (sec < 10) {
            sec = '0' + sec;
        }

        return minutes + ':' + sec;
    };

    /**
     * @param   {String} date
     * @returns {String}
     */
    data.shortDate = function (date) {
        let shortdate = '';

        if (typeof date === 'number') {
            shortdate = moment.unix(date).format('YYYY-MM-DD');
        } else {
            shortdate = moment(date).format('YYYY-MM-DD');
        }

        return moment().format('YYYY-MM-DD') === shortdate ? 'Today' : shortdate;
    };

    /**
     * @param   {String} date
     * @returns {String}
     */
    data.shortTime = function (date) {
        let shorttime = '';

        if (typeof date === 'number') {
            shorttime = moment.unix(date).format('H:mm A');
        } else {
            shorttime = moment(date).format('H:mm A');
        }

        return shorttime;
    };

    /**
     * @param   {String} string
     * @returns {String}
     */
    data.escape = function (string) {
        let entityMap = {
            '&':  '&amp;',
            '<':  '&lt;',
            '>':  '&gt;',
            '"':  '&quot;',
            '\'': '&#39;',
            '/':  '&#x2F;'
        };

        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    };

    /**
     * @param   {String} string
     * @param   {Integer} length
     * @returns {String}
     */
    data.trim = function (string, length) {
        if (string.length > length) {
            let trimmedString = string.substr(0, length);
            return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) + '...';
        }

        return string;
    };

    /**
     * @param   {String}  digest
     * @returns {String}
     */
    data.getShortDigestId = function (digest) {
        return digest.replace(/^sha256:(.{12}).*/gim, '$1');
    };

    /**
     * @param   {Integer}  bytes
     * @returns {String}
     */
    data.bytesToMb = function (bytes) {
        if (bytes < 1024) {
            return bytes + ' b';
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(0) + ' kb';
        } else {
            return (bytes / 1024 / 1024).toFixed(0) + ' mb';
        }
    };

    /**
     * @returns {Boolean}
     */
    data.isDeleteEnabled = function () {
        return Cache.Config.REGISTRY_STORAGE_DELETE_ENABLED || false;
    };

    /**
     * @returns {String}
     */
    data.getRegistryDomain = function () {
        return Cache.Config.REGISTRY_DOMAIN || window.location.hostname;
        //return window.location.hostname
    };

    return render.call(this, template, data, view);
};

module.exports = Mn;
