import numeral from 'numeral';

export default {

    /**
     * @param   {Integer} number
     * @returns {String}
     */
    niceNumber: function (number) {
        return numeral(number).format('0,0');
    },

    /**
     * @param   {String}  digest
     * @returns {String}
     */
    getShortDigestId: function (digest) {
        return digest.replace(/^sha256:(.{12}).*/gim, '$1');
    }
};
