import {tbody} from '@hyperapp/html';
import Trow from './table-row';
import _ from 'lodash';

/**
 * @param   {Object}   fields
 * @param   {Array}    rows
 */
export default (fields, rows) => {
    let field_keys = [];

    _.map(fields, (val, key) => {
        field_keys.push(key);
    });

    return tbody(rows.map(row => {
        return Trow(_.pick(row, field_keys), fields);
    }));
}

