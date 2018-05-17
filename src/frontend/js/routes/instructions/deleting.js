import {div, h1, h3, p, pre, code} from '@hyperapp/html';
import Nav from '../../components/tabler/nav';

export default (state, actions) => params => div(
    Nav(state.status.config.REGISTRY_STORAGE_DELETE_ENABLED),
    div({class: 'my-3 my-md-5'},
        div({class: 'container'}, [
            h1({class: 'page-title mb-5'}, 'Deleting from this Registry'),
            div({class: 'card'},
                div({class: 'card-body'},
                    p('Deleting from a Docker Registry is possible, but not very well implemented. For this reason, deletion options were disabled in this Registry UI project by default. However if you still want to be able to delete images from this registry you will need to set a few things up.'),
                )
            ),
            div({class: 'card'}, [
                div({class: 'card-header'},
                    h3({class: 'card-title'}, 'Permit deleting on the Registry')
                ),
                div({class: 'card-body'}, [
                    p('This step is pretty simple and involves adding an environment variable to your Docker Registry Container when you start it up:'),
                    pre(
                        code('docker run -d -p 5000:5000 -e REGISTRY_STORAGE_DELETE_ENABLED=true --name my-registry registry:2')
                    )
                ])
            ]),
            div({class: 'card'}, [
                div({class: 'card-header'},
                    h3({class: 'card-title'}, 'Cleaning up the Registry')
                ),
                div({class: 'card-body'}, [
                    p('When you delete an image from the registry this won\'t actually remove the blob layers as you might expect. For this reason you have to run this command on your docker registry host to perform garbage collection:'),
                    pre(
                        code('docker exec -it my-registry bin/registry garbage-collect /etc/docker/registry/config.yml')
                    ),
                    p('And if you wanted to make a cron job that runs every 30 mins:'),
                    pre(
                        code('0,30 * * * * /bin/docker exec -it my-registry bin/registry garbage-collect /etc/docker/registry/config.yml >> /dev/null 2>&1')
                    )
                ])
            ])
        ])
    )
);

