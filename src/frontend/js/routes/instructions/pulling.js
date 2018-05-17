import {div, h1, p, pre, code} from '@hyperapp/html';
import Nav from '../../components/tabler/nav';
import Insecure from '../../components/app/insecure-registries';

export default (state, actions) => params => {
    let domain = state.status.config.REGISTRY_DOMAIN || window.location.hostname;

    return div(
        Nav(state.status.config.REGISTRY_STORAGE_DELETE_ENABLED),
        div({class: 'my-3 my-md-5'},
            div({class: 'container'}, [
                h1({class: 'page-title mb-5'}, 'Pulling from this Registry'),
                div({class: 'card'},
                    div({class: 'card-body'},
                        p('Viewing any Image from the Repositories menu will give you a command in the following format:'),
                        pre(
                            code('docker pull ' + domain + '/<someimage>:<tag>')
                        )
                    )
                ),
                Insecure(domain)
            ])
        )
    );
}
