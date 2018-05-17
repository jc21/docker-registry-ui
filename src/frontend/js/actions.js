import {location} from 'hyperapp-hash-router';
import Api from './lib/api';
import $ from 'jquery';
import moment from 'moment';

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
        try {
            let status = await Api.status();
            $('#version_number').text([status.version.major, status.version.minor, status.version.revision].join('.'));
            let repos = await Api.Repos.getAll(true);

            // Hack to remove any image that has no tags
            let clean_repos = [];
            repos.map(repo => {
                if (typeof repo.tags !== 'undefined' && repo.tags !== null && repo.tags.length) {
                    clean_repos.push(repo);
                }
            });

            actions.updateState({isLoading: false, status: status, repos: clean_repos, globalError: null});
        } catch (err) {
            actions.updateState({isLoading: false, globalError: err});
        }
    },

    /**
     * @returns {Function}
     */
    fetchImage: image_id => async (state, actions) => {
        if (typeof fetching[image_id] === 'undefined' || !fetching[image_id]) {
            fetching[image_id] = true;

            let image_item = {
                err:       null,
                timestamp: parseInt(moment().format('X'), 10),
                data:      null
            };

            try {
                image_item.data = await Api.Repos.get(image_id, true);
            } catch (err) {
                image_item.err = err;
            }

            let new_state              = {images: state.images};
            new_state.images[image_id] = image_item;
            actions.updateState(new_state);
            fetching[image_id] = false;
        }
    },

    deleteImageClicked: e => async (state, actions) => {
        let $btn     = $(e.currentTarget).addClass('btn-loading disabled').prop('disabled', true);
        let $modal   = $btn.parents('.modal').first();
        let image_id = $btn.data('image_id');

        Api.Repos.delete(image_id, $btn.data('digest'))
            .then(result => {
                if (typeof result.code !== 'undefined' && result.code === 'UNSUPPORTED') {
                    throw new Error('Deleting is not enabled on the Registry');
                } else if (result === true) {
                    $modal.modal('hide');

                    let new_state = {
                        isLoaded: true,
                        images:   state.images
                    };

                    delete new_state.images[image_id];

                    setTimeout(function () {
                        actions.updateState(new_state);

                        actions.location.go('/');
                        actions.bootstrap();
                    }, 300);
                } else {
                    throw new Error('Unrecognized response: ' + JSON.stringify(result));
                }
            })
            .catch(err => {
                console.error(err);
                $modal.find('.modal-body').append($('<p>').addClass('text-danger').text(err.message));
                $btn.removeClass('btn-loading disabled').prop('disabled', false);
            });
    }
};

export default actions;
