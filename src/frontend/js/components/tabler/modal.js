import {div} from '@hyperapp/html';
import $ from 'jquery';

export default (content, onclose) => div({class: 'modal fade', tabindex: '-1', role: 'dialog', ariaHidden: 'true', oncreate: function (elm) {
    let modal = $(elm);
    modal.modal('show');

    if (typeof onclose === 'function') {
        modal.on('hidden.bs.modal', onclose);
    }
}}, content);
