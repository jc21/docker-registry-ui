import {div, h1, span, a} from '@hyperapp/html';
import Nav from '../components/tabler/nav';
import BigError from '../components/tabler/big-error';
import ImageTag from '../components/app/image-tag';

export default (state, actions) => params => {
    let image_id = params.match.params.imageId;
    let view     = [];

    if (typeof state.images[image_id] === 'undefined' || state.images[image_id] === null) {
        // doesn't exist, show loading, fire off action to get it
        view.push(span({class: 'loader'}));
        actions.fetchImage(image_id);
    } else {
        let data = state.images[image_id];
        if (typeof data.code !== 'undefined' && data.code) {
            // show err
            view.push(BigError(data.code, data.message,
                a({
                    class: 'btn btn-link', onclick: function () {
                        actions.fetchImage(image_id);
                    }
                }, 'Refresh')
            ));
        } else {
            view.push(h1({class: 'page-title mb-5'}, image_id));
            view.push(div(data.tags.map(tag => ImageTag(tag, state.status.config))));
        }
    }

    return div(
        Nav(),
        div({class: 'my-3 my-md-5'},
            div({class: 'container'}, view)
        )
    );
}
