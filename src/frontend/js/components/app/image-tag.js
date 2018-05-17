import {div, h3, p, a} from '@hyperapp/html';
import Utils from '../../lib/utils';

export default (tag, config) => {
    let total_size = 0;
    if (typeof tag.layers !== 'undefined' && tag.layers) {
        tag.layers.map(layer => total_size += layer.size);
        total_size = total_size / 1024 / 1024;
        total_size = total_size.toFixed(0);
    }

    let domain = config.REGISTRY_DOMAIN || window.location.hostname;

    return div({class: 'card tag-card'}, [
        div({class: 'card-header'},
            h3({class: 'card-title'}, tag.name)
        ),
        div({class: 'card-alert alert alert-secondary mb-0 pull-command'},
            'docker pull ' + domain + '/' + tag.image_name + ':' + tag.name
        ),
        div({class: 'card-body'},
            div({class: 'row'}, [
                div({class: 'col-lg-3 col-sm-6'}, [
                    div({class: 'h6'}, 'Image ID'),
                    p(Utils.getShortDigestId(tag.config.digest))
                ]),
                div({class: 'col-lg-3 col-sm-6'}, [
                    div({class: 'h6'}, 'Author'),
                    p(tag.info.author)
                ]),
                div({class: 'col-lg-3 col-sm-6'}, [
                    div({class: 'h6'}, 'Docker Version'),
                    p(tag.info.docker_version)
                ]),
                div({class: 'col-lg-3 col-sm-6'}, [
                    div({class: 'h6'}, 'Size'),
                    p(total_size ? total_size + ' mb' : 'Unknown')
                ])
            ])
        )
    ]);
}
