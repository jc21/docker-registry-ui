import {div, i, h1, p, a} from '@hyperapp/html';

/**
 * @param {Number}  code
 * @param {String}  message
 * @param {*}       [detail]
 * @para, {Boolean} [hide_back_button]
 */
export default (code, message, detail, hide_back_button) =>
    div({class: 'container text-center'}, [
        div({class: 'display-1 text-muted mb-5'}, [
            i({class: 'si si-exclamation'}),
            code
        ]),
        h1({class: 'h2 mb-3'}, message),
        p({class: 'h4 text-muted font-weight-normal mb-7'}, detail),
        hide_back_button ? null : a({class: 'btn btn-primary', href: 'javascript:history.back();'}, [
            i({class: 'fe fe-arrow-left mr-2'}),
            'Go back'
        ])
    ]);
