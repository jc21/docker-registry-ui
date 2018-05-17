import {div, i, ul, li, a} from '@hyperapp/html';
import {Link} from 'hyperapp-hash-router';

export default (show_delete) => {

    let selected = 'images';
    if (window.location.hash.substr(0, 14) === '#/instructions') {
        selected = 'instructions';
    }

    return div({class: 'header collapse d-lg-flex p-0', id: 'headerMenuCollapse'},
        div({class: 'container'},
            div({class: 'row align-items-center'},
                div({class: 'col-lg order-lg-first'}, [
                    ul({class: 'nav nav-tabs border-0 flex-column flex-lg-row'}, [
                        li({class: 'nav-item'},
                            Link({class: 'nav-link' + (selected === 'images' ? ' active' : ''), to: '/'}, [
                                i({class: 'fe fe-box'}),
                                'Images'
                            ])
                        ),
                        li({class: 'nav-item'}, [
                            a({class: 'nav-link' + (selected === 'instructions' ? ' active' : ''), href: 'javascript:void(0)', 'data-toggle': 'dropdown'}, [
                                i({class: 'fe fe-feather'}),
                                'Instructions'
                            ]),
                            div({class: 'dropdown-menu dropdown-menu-arrow'}, [
                                Link({class: 'dropdown-item', to: '/instructions/pulling'}, 'Pulling'),
                                Link({class: 'dropdown-item', to: '/instructions/pushing'}, 'Pushing'),
                                show_delete ? Link({class: 'dropdown-item', to: '/instructions/deleting'}, 'Deleting') : null
                            ])
                        ])
                    ])
                ])
            )
        )
    );
}
