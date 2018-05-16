import {tr, td} from '@hyperapp/html';
import _ from 'lodash';

/**
 * @param   {Object}  row
 * @param   {Object}  fields
 */
export default function (row, fields) {
    let cells = [];

    _.map(row, (cell, key) => {
        let manipulator = fields[key].manipulator || null;
        let value = cell;

        if (typeof cell === 'object' && cell !== null && typeof cell.value !== 'undefined') {
            value = cell.value;
        }

        if (typeof manipulator === 'function') {
            value = manipulator(value, cell);
        }

        if (typeof cell.attributes !== 'undefined' && cell.attributes) {
            cells.push(td(cell.attributes, value));
        } else {
            cells.push(td(value));
        }
    });

    return tr(cells);
};
