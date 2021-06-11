import * as actionTypes from '../actions';

const initialState = {
    images: [],
    videos: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.IMAGE:
            return {
                ...state,
                images: [...state.images, ...action.images]
            }

        case actionTypes.VIDEO:
            return {
                ...state,
                videos: [...state.videos, ...action.videos]
            }
            
        case actionTypes.UPLOAD_IMAGE:
        return {
            ...state,
            images: []
        };

        case actionTypes.UPLOAD_VIDEO:
            return {
                ...state,
                videos: []
            };

        default:
            return state;
    }
};

export default reducer;