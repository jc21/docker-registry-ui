import {div, table} from '@hyperapp/html';
import Thead from './table-head';
import Tbody from './table-body';

/**
 * @param   {Array}    header
 * @param   {Object}   fields
 * @param   {Array}    rows
 */
export default (header, fields, rows) =>
    div({class: 'card'},
        div({class: 'table-responsive'},
            table({class: 'table table-hover table-outline table-vcenter text-nowrap card-table'}, [
                Thead(header),
                Tbody(fields, rows)
            ])
        )
    );
