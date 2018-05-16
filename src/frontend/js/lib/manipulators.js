import {div} from '@hyperapp/html';
import {Link} from 'hyperapp-hash-router';

export default {

    /**
     * @returns {Function}
     */
    imageName: function () {
        return (value, cell) => {
            return Link({to: '/image/' + value}, value);
        }
    },

    /**
     * @param   {String} delimiter
     * @returns {Function}
     */
    joiner: delimiter => (value, cell) => value.join(delimiter)

};
