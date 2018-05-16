import {Route} from 'hyperapp-hash-router';
import {div, span} from '@hyperapp/html';

import ImagesRoute from './routes/images';
import ImageRoute from './routes/image';
import PushingRoute from './routes/images';
import PullingRoute from './routes/images';
import DeletingRoute from './routes/images';

export default (state, actions) => {
    if (state.isLoading) {
        return span({class: 'loader'});
    } else {
        return div(
            Route({path: '/', render: ImagesRoute(state, actions)}),
            Route({path: '/image/:imageId', render: ImageRoute(state, actions)}),
            Route({path: '/instructions/pushing', render: PushingRoute(state, actions)}),
            Route({path: '/instructions/pulling', render: PullingRoute(state, actions)}),
            Route({path: '/instructions/deleting', render: DeletingRoute(state, actions)})
        );
    }
}
