import {div, h1, p, pre, code} from '@hyperapp/html';
import Nav from '../../components/tabler/nav';
import Insecure from '../../components/app/insecure-registries';

export default (state, actions) => params => {
    let domain = state.status.config.REGISTRY_DOMAIN || window.location.hostname;

    return div(
        Nav(state.status.config.REGISTRY_STORAGE_DELETE_ENABLED),
        div({class: 'my-3 my-md-5'},
            div({class: 'container'}, [
                h1({class: 'page-title mb-5'}, 'Pushing to this Registry'),
                div({class: 'card'},
                    div({class: 'card-body'},
                        p('After you pull or build an image:'),
                        pre(
                            code('docker tag <someimage> ' + domain + '/<someimage>:<tag>' + "\n" +
                                'docker push ' + domain + '/<someimage>:<tag>')
                        )
                    )
                ),
                Insecure(domain)
            ])
        )
    );
}
