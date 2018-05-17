import {location} from 'hyperapp-hash-router';

export default {
    location:           location.state,
    isLoading:          true,
    globalError:        null,
    confirmDeleteImage: null,
    images:             {}
};
