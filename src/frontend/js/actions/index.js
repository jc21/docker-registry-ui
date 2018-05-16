import {location} from 'hyperapp-hash-router';
import Api from '../lib/api';
import $ from 'jquery';

const fetching = {};

const actions = {
    location: location.actions,

    /**
     * @param state
     * @returns {*}
     */
    updateState: state => state,

    /**
     * @returns {Function}
     */
    bootstrap: () => async (state, actions) => {
        let status = await Api.status();
        $('#version_number').text([status.version.major, status.version.minor, status.version.revision].join('.'));

        let repos = await Api.Repos.getAll(true);
        actions.updateState({isLoading: false, status: status, repos: repos});
    },

    /**
     * @returns {Function}
     */
    fetchImage: image_id => async (state, actions) => {
        if (typeof fetching[image_id] === 'undefined' || !fetching[image_id]) {
            // Reset
            fetching[image_id]       = true;
            let new_state              = {images: {}};
            new_state.images[image_id] = null;
            actions.updateState(new_state);

            // Fetch
            let image = null;
            try {
                image = await Api.Repos.get(image_id, true);
            } catch (err) {
                image = err;
            }

            new_state.images[image_id] = image;
            actions.updateState(new_state);
            fetching[image_id] = false;
        }
    }
};

export default actions;
