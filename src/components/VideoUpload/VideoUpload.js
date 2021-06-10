import React, { Component } from 'react';
import '../../sass/components/upload.scss';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actionTypes from '../../store/actions';
import axios from '../../axios';

import Spinner from '../Spinner/Spinner';
import Modal from '../Modal/Modal';

class VideoUpload extends Component {
    state = {
        isDragOver: false,
        isLoading: false,
        isUploadSuccessful: false
    };

    onDragOver = (event) => {
        event.preventDefault();
        this.setState({isDragOver: true});
    }

    onDragLeave = () => {
        this.setState({isDragOver: false});
    }

    onVideoUpload = (videos) => {
        if(videos.length > 0) {
            videos.forEach(video => {
                const videoData = {
                    preview: video.preview,
                    name: video.name,
                    lastModifiedDate: video.lastModifiedDate,
                    type: video.type
                }
                
                this.setState({isLoading: true});
                axios.post('/videos.json', videoData)
                .then(response => {
                    console.log(response);
                    this.setState({isLoading: false});
                    this.setState({ isUploadSuccessful: true });
                })
                .catch(error => console.log(error));
            });
        }

        this.props.updateVideoStore();
    }

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
                    onDrop={(event) => this.props.onFilesDrop(event)}>

                    { videoThumbnals.length === 0 ? 
                        <div>
                            <i className="fas fa-cloud-upload-alt upload__icon"></i>
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
        onFilesDrop: (event) => dispatch({type: actionTypes.VIDEO, event: event}),
        updateVideoStore: () => dispatch({type: actionTypes.UPLOAD_VIDEO})
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(VideoUpload);