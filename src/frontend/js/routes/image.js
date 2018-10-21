import {div, h1, span, a, h4, button, p} from '@hyperapp/html';
import Nav from '../components/tabler/nav';
import BigError from '../components/tabler/big-error';
import ImageTag from '../components/app/image-tag';
import Modal from '../components/tabler/modal';
import moment from 'moment';

export default (state, actions) => params => {
    let image_id            = params.match.params.imageId;
    let view                = [];
    let delete_enabled      = state.status.config.REGISTRY_STORAGE_DELETE_ENABLED || false;
    let refresh             = false;
    let digest              = null;
    let now                 = parseInt(moment().format('X'), 10);
    let append_delete_model = false;
    let image               = null;

    if (typeof params.match.params.imageDomain !== 'undefined' && params.match.params.imageDomain.length > 0) {
      image_id = [params.match.params.imageDomain, image_id].join('/');
    }

    // if image doesn't exist in state: refresh
    if (typeof state.images[image_id] === 'undefined' || !state.images[image_id]) {
        refresh = true;
    } else {
        image = state.images[image_id];

        // if image does exist, but hasn't been refreshed in < 30 seconds, refresh
        if (image.timestamp < (now - 30)) {
            refresh = true;

            // if image does exist, but has error, show error
        } else if (image.err) {
            view.push(BigError(image.err.code, image.err.message,
                a({
                    class: 'btn btn-link', onclick: function () {
                        actions.fetchImage(image_id);
                    }
                }, 'Refresh')
            ));

            // if image does exist, but has no error and no data, 404
        } else if (!image.data || typeof image.data.tags === 'undefined' || image.data.tags === null || !image.data.tags.length) {
            view.push(BigError(404, image_id + ' does not exist in this Registry',
                a({
                    class: 'btn btn-link', onclick: function () {
                        actions.fetchImage(image_id);
                    }
                }, 'Refresh')
            ));
        } else {
            // Show it
            // This is where shit gets weird. Digest is the same for all tags, but only stored with a tag.
            digest              = image.data.tags[0].digest;
            append_delete_model = delete_enabled && state.confirmDeleteImage === image_id;

            view.push(h1({class: 'page-title mb-5'}, [
                delete_enabled ? a({
                    class: 'btn btn-secondary btn-sm ml-2 pull-right', onclick: function () {
                        actions.updateState({confirmDeleteImage: image_id});
                    }
                }, 'Delete') : null,
                image_id
            ]));
            view.push(div(image.data.tags.map(tag => ImageTag(tag, state.status.config))));
        }
    }

    if (refresh) {
        view.push(span({class: 'loader'}));
        actions.fetchImage(image_id);
    }

    return div(
        Nav(state.status.config.REGISTRY_STORAGE_DELETE_ENABLED),
        div({class: 'my-3 my-md-5'},
            div({class: 'container'}, view)
        ),
        // Delete modal
        append_delete_model ? Modal(
            div({class: 'modal-dialog'},
                div({class: 'modal-content'}, [
                    div({class: 'modal-header text-left'},
                        h4({class: 'modal-title'}, 'Confirm Delete')
                    ),
                    div({class: 'modal-body'},
                        p('Are you sure you want to delete this image and tag' + (image.data.tags.length === 1 ? '' : 's') + '?')
                    ),
                    div({class: 'modal-footer'}, [
                        button({
                            class:           'btn btn-danger',
                            type:            'button',
                            onclick:         actions.deleteImageClicked,
                            'data-image_id': image_id,
                            'data-digest':   digest
                        }, 'Yes I\'m sure'),
                        button({class: 'btn btn-default', type: 'button', 'data-dismiss': 'modal'}, 'Cancel')
                    ])
                ])
            ),
            // onclose function
            function () {
                actions.updateState({confirmDeleteImage: null});
            }) : null
    );
}
