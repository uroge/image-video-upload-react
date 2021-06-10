import * as actionTypes from '../actions';

const initialState = {
    images: [],
    videos: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPLOAD:
            console.log('cliked');
            return state;

        default:
            return state;
    }
};

export default reducer;