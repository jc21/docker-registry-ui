import {div, h3, h4, p, pre, code} from '@hyperapp/html';

export default domain => div({class: 'card'},
    div({class: 'card-header'},
        h3({class: 'card-title'}, 'Insecure Registries')
    ),
    div({class: 'card-body'}, [
        p('If this registry is insecure and doesn\'t hide behind SSL certificates then you will need to configure your Docker client to allow pushing to this insecure registry.'),
        h4('Linux'),
        p('Edit or you may even need to create the following file on your Linux server:'),
        pre(
            code('/etc/docker/daemon.json')
        ),
        p('And save the following content:'),
        pre(
            code(JSON.stringify({'insecure-registries': [domain]}, null, 2))
        ),
        p('You will need to restart your Docker service before these changes will take effect.')
    ])
);
