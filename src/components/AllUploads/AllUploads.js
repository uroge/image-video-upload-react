import React, { Component } from 'react';
import '../../sass/components/allUploads.scss';

import axios from '../../axios';
import { Link } from 'react-router-dom';

class AllUploads extends Component {
    state = {
        images: [],
        videos: []
    }

    componentDidMount() {
        axios.get('https://image-video-react-default-rtdb.firebaseio.com/images.json')
        .then(response => this.setState({ images: Object.values(response.data) }))
        .catch(error => console.log(error));

        axios.get('https://image-video-react-default-rtdb.firebaseio.com/videos.json')
        .then(response => {
            this.setState({ videos: Object.values(response.data) })
        })
        .catch(error => console.log(error));
    }

    render() {
        let imageThumbnails = null;
        let videoThumbnails = null;

        if(this.state.images) {
            imageThumbnails = this.state.images.map(image => (
                <div className="all-uploads__thumb" style={{backgroundImage: `url(${image.preview})`}} key={Math.random()}>
                </div>
            ));
        }

        if(this.state.videos) {
            videoThumbnails = this.state.videos.map(video => (
                <video src={video.preview} className="all-uploads__thumb" key={Math.random()} />
            ));
        }

        return(
            <section className="all-uploads">
                <div className="all-uploads__images">
                    <h1 className="all-uploads__heading">Uploaded Images:</h1>
                    <div className="all-uploads__images-container js-all-uploads__images-container">
                        {imageThumbnails}
                    </div>
                </div>
                <div className="all-uploads__videos">
                    <h1 className="all-uploads__heading">Uploaded Videos:</h1>
                    <div className="all-uploads__videos-container js-all-uploads__videos-container">
                        {videoThumbnails}
                    </div>
                </div>
                <Link to="/" className="all-uploads__link">Back to Home Page</Link>
            </section>
        );
    }
}

export default AllUploads;