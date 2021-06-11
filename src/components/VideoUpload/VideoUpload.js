import React, { Component } from 'react';
import '../../sass/components/upload.scss';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import * as actionTypes from '../../store/actions';
import { app } from '../../firebase.utils';

import Spinner from '../Spinner/Spinner';
import Modal from '../Modal/Modal';
import { AiOutlineCloudUpload } from 'react-icons/ai';

class VideoUpload extends Component {
    state = {
        isDragOver: false,
        isLoading: false,
        isUploadSuccessful: false
    };

    /**
     * Function that sets isDragOver to true
     * and adds dragover class to upload content
     * @param {*} event - onDragOver event
    */
    onDragOver = (event) => {
        event.preventDefault();
        this.setState({isDragOver: true});
    }


    /**
     * Function that sets isDragOver to false
     * and removes dragover class to upload content
     * @param {*} event - onDragLeave event
    */
    onDragLeave = () => {
        this.setState({isDragOver: false});
    }

    /**
     * Function that accepts dropped images, creates thumbnail
     * and passes them to reducer
     * @param {*} event - onDrop event
    */
     onVideoDrop = (event) => {
        event.preventDefault();
        const acceptedVideos = [...event.dataTransfer.files];

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

        this.props.onFilesDrop(modifiedVideos);
        this.setState({isDragOver: false});
    }

    /**
     * Function that creates url for every videos
     * and sends videos to database
     * @param {Array} videos - array of videos from the store
    */
    onVideoUpload = (videos) => {    
        this.setState({isLoading: true});
        if(videos.length > 0) {
            videos.forEach(async (video) => {
                const storageRef = app.storage().ref(`videos/`);
                const fileRef = storageRef.child(video.name);

                await fileRef.put(video);
                const fileUrl = await fileRef.getDownloadURL();

                const videoData = {
                    preview: fileUrl,
                    name: video.name,
                    lastModifiedDate: video.lastModifiedDate,
                    type: video.type
                }
                console.log(fileUrl);
                axios.post('/videos.json', videoData)
                .then(response => {
                    console.log(response);
                    this.setState({isLoading: false});
                    this.setState({ isUploadSuccessful: true });
                })
                .catch(error => console.log(error));
            });
        } else {
            alert('Nothing to upload');
        }

        this.props.updateVideoStore();
    }

    
    /**
     * Function that sets isUploadSuccessful to false
     * and closes the modal 
    */
    modalCloseHandler = () => {
        this.setState({ isUploadSuccessful: false });
    }

    render() {
        const videoThumbnals = this.props.videos.map((video) => {
            return <video src={video.preview} alt={video.name} key={Math.random()} className="upload__thumb" />;
        });

        return (
        <>
            <section className="heading">
                <h1>Upload a Video</h1>
            </section>
            { this.state.isUploadSuccessful ?  <Modal show={this.state.isUploadSuccessful} modalClosed={this.modalCloseHandler}>
                Videos Uploaded Successfully
            </Modal> : null }
            <section className="upload">
                <div className={`upload__content${this.state.isDragOver ? ' upload__dragover' : ''}`} 
                    onDragLeave={this.onDragLeave} 
                    onDragOver={(event) => this.onDragOver(event)}
                    onDrop={(event) => this.onVideoDrop(event)}>

                    { !videoThumbnals.length ? 
                        <div>
                            <AiOutlineCloudUpload className="upload__icon"/>
                            <h5>Drag & Drop a Video to upload it</h5>
                        </div>
                    : null }

                    {this.state.isLoading ? <Spinner/> : null}

                    <div className="upload__thumbs">
                        { videoThumbnals.length > 0 ? videoThumbnals : null }
                    </div>
                    <button className="upload__button" onClick={() => this.onVideoUpload(this.props.videos)}>Upload</button>
                    <input type="file" hidden="hidden" multiple/>
                    <p></p>
                    <Link to="/all-uploads" className="upload__all">See all uploads</Link>
                </div>
            </section>
        </>
        );
    }
}

const mapStateToProps = state => {
    return {
        videos: state.videos
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFilesDrop: (videos) => dispatch({type: actionTypes.VIDEO, videos: videos}),
        updateVideoStore: () => dispatch({type: actionTypes.UPLOAD_VIDEO})
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(VideoUpload);