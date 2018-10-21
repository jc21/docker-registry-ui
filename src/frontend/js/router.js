import {Route} from 'hyperapp-hash-router';
import {div, span, a, p} from '@hyperapp/html';
import ImagesRoute from './routes/images';
import ImageRoute from './routes/image';
import PushingRoute from './routes/instructions/pushing';
import PullingRoute from './routes/instructions/pulling';
import DeletingRoute from './routes/instructions/deleting';
import BigError from './components/tabler/big-error';

export default (state, actions) => {
    if (state.isLoading) {
        return span({class: 'loader'});
    } else {

        if (state.globalError !== null && state.globalError) {
            return BigError(state.globalError.code || '500', state.globalError.message,
                [
                    p('There may be a problem communicating with the Registry'),
                    a({
                        class: 'btn btn-link', onclick: function () {
                            actions.bootstrap();
                        }
                    }, 'Refresh')
                ],
                true
            );
        } else {
            return div(
                Route({path: '/', render: ImagesRoute(state, actions)}),
                Route({path: '/image/:imageId', render: ImageRoute(state, actions)}),
                Route({path: '/image/:imageDomain/:imageId', render: ImageRoute(state, actions)}),
                Route({path: '/instructions/pushing', render: PushingRoute(state, actions)}),
                Route({path: '/instructions/pulling', render: PullingRoute(state, actions)}),
                Route({path: '/instructions/deleting', render: DeletingRoute(state, actions)})
            );
        }
    }
}
