import * as actionTypes from '../actions';

const initialState = {
    images: [],
    videos: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.IMAGE:
            action.event.preventDefault();
            const acceptedImages = [...action.event.dataTransfer.files];

            const modifiedImages = [];

            acceptedImages.forEach(async (image) => {
                const reader = new FileReader();

                reader.readAsDataURL(image);

                if(image.type.startsWith('image/')) {
                    reader.onload = () => {
                        modifiedImages.push(Object.assign(image, {
                            preview: reader.result
                        }));
                        console.log('[FileReader] finished')
                    }
                } else {
                    alert('File type not supported!');
                }
            });

            console.log('[Modified Images]: ' + modifiedImages)
            return {
                ...state,
                images: [...state.images, ...modifiedImages]
            }

        case actionTypes.VIDEO:
            action.event.preventDefault();
            const acceptedVideos = [...action.event.dataTransfer.files];

            const modifiedVideos = [];

            acceptedVideos.forEach(video => {
                if(video.type.startsWith('video/')) {
                    modifiedVideos.push(Object.assign(video, {
                        preview: URL.createObjectURL(video)
                    }));
                } else {
                    alert('File type not supported!');
                }
            });
            
            return {
                ...state,
                videos: [...state.videos, ...modifiedVideos]
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