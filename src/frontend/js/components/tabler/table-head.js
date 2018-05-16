import {thead, tr, th} from '@hyperapp/html';
import _ from 'lodash';

/**
 * @param {Array}   header
 */
export default function (header) {
    let cells = [];

    _.map(header, cell => {
        if (typeof cell === 'object' && typeof cell.class !== 'undefined' && cell.class) {
            cells.push(th({class: cell.class}, cell.value));
        } else {
            cells.push(th(cell));
        }
    });

    return thead({},
        tr({}, cells)
    );
};
