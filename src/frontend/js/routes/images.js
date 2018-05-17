import {Link} from 'hyperapp-hash-router';
import {div, h4, p} from '@hyperapp/html';
import Nav from '../components/tabler/nav';
import TableCard from '../components/tabler/table-card';
import Manipulators from '../lib/manipulators';
import {a} from '@hyperapp/html/dist/html';

export default (state, actions) => params => {
    let content = null;

    if (!state.repos || !state.repos.length) {
        // empty
        content = div({class: 'alert alert-success'}, [
            h4('Nothing to see here!'),
            p('There are no images in this Registry yet.'),
            div({class: 'btn-list'},
                Link({class: 'btn btn-success', to: '/instructions/pushing'}, 'How to push an image')
            )
        ]);

    } else {
        content = TableCard([
                'Name',
                'Tags'
            ], {
                name: {manipulator: Manipulators.imageName()},
                tags: {manipulator: Manipulators.joiner(', ')}
            }, state.repos);
    }

    return div(
        Nav(state.status.config.REGISTRY_STORAGE_DELETE_ENABLED),
        div({class: 'my-3 my-md-5'},
            div({class: 'container'}, content)
        ),
        p({class: 'text-center'},
            a({
                class: 'btn btn-link text-faded', onclick: function () {
                    actions.bootstrap();
                }
            }, 'Refresh')
        )
    );
}
