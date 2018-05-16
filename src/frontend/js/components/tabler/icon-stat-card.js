import {div, i, span, h4, small} from '@hyperapp/html';
import Utils from '../../lib/utils';

/**
 * @param {String|Number}  stat_number
 * @param {String}  stat_text
 * @param {String}  icon        without 'fe-' prefix
 * @param {String}  color       ie: 'green' from tabler 'bg-' class names
 */
export default (stat_number, stat_text, icon, color) =>
    div({class: 'card p-3'},
        div({class: 'd-flex align-items-center'}, [
            span({class: 'stamp stamp-md bg-' + color + ' mr-3'},
                i({class: 'fe fe-' + icon})
            ),
            div({},
                h4({class: 'm-0'}, [
                    typeof stat_number === 'number' ? Utils.niceNumber(stat_number) : stat_number,
                    small(' ' + stat_text)
                ])
            )
        ])
    );
