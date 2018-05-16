import {div} from '@hyperapp/html';
import Nav from '../components/tabler/nav';
import TableCard from '../components/tabler/table-card';
import Manipulators from '../lib/manipulators';

export default (state, actions) => params =>
    div(
        Nav(),
        div({class: 'my-3 my-md-5'},
            div({class: 'container'}, [
                TableCard([
                    'Name',
                    'Tags'
                ], {
                    name: {manipulator: Manipulators.imageName()},
                    tags: {manipulator: Manipulators.joiner(', ')}
                }, state.repos)
            ])
        )
    );
