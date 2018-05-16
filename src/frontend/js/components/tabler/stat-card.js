import {div, i} from '@hyperapp/html';
import Utils from '../../lib/utils';

/**
 * @param {String|Number}  big_stat
 * @param {String}  stat_text
 * @param {String}  small_stat
 * @param {Boolean} negative       If truthy, shows as red. Otherwise, green.
 */
export default (big_stat, stat_text, small_stat, negative) =>
    div({class: 'card'},
        div({class: 'card-body p-3 text-center'}, [
            small_stat ? div({class: 'text-right ' + (negative ? 'text-red' : 'text-green')}, [
                small_stat,
                i({class: 'fe ' + (negative ? 'fe-chevron-down' : 'fe-chevron-up')})
            ]) : null,
            div({class: 'h1 m-0'}, typeof big_stat === 'number' ? Utils.niceNumber(big_stat) : big_stat),
            div({class: 'text-muted mb-4'}, stat_text)
        ])
    );
