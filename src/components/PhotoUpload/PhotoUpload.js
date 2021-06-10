import React, { Component } from 'react';
import '../../sass/components/upload.scss';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import * as actionTypes from '../../store/actions';

import Spinner from '../Spinner/Spinner';
import Modal from '../Modal/Modal';

class PhotoUpload extends Component {
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

    onImageUpload = (images) => {
        if(images.length > 0) {
            images.forEach(image => {
                const imageData = {
                    preview: image.preview,
                    name: image.name,
                    lastModifiedDate: image.lastModifiedDate,
                    type: image.type
                }
                this.setState({isLoading: true});
                axios.post('/images.json', imageData)
                .then(response => {
                    console.log(response);
                    this.setState({ isLoading: false });
                    this.setState({ isUploadSuccessful: true });
                })
                .catch(error => console.log(error));
            });
        } else {
            alert('Nothing to upload');
        }

        this.props.updateImageStore();
    }

    modalCloseHandler = () => {
        this.setState({ isUploadSuccessful: false });
    }

    render() {
        const imageThumbnals = this.props.images.map((image) => {
            return <img src={image.preview} alt={image.name} key={Math.random()} className="upload__thumb" />;
        });

        return (
        <>
            <section className="heading">
                <h1>Upload a Photo</h1>
            </section>
            { this.state.isUploadSuccessful ?  <Modal show={this.state.isUploadSuccessful} modalClosed={this.modalCloseHandler}>
                Images Uploaded Successfully
            </Modal> : null }
            <section className="upload">
                <div className={`upload__content${ this.state.isDragOver ? ' upload__dragover' : '' }`} 
                    onDragLeave={ this.onDragLeave } 
                    onDragOver={ (event) => this.onDragOver(event)}
                    onDrop={(event) => this.props.onFilesDrop(event)} >
                        
                    { imageThumbnals.length === 0 && this.state.isLoading === false ? 
                        <div>
                            <i className="fas fa-cloud-upload-alt upload__icon"></i>
                            <h5>Drag & Drop an image to upload it</h5>
                        </div> 
                    : null }

                    {this.state.isLoading ? <Spinner/> : null}

                    <div className="upload__thumbs">
                        { imageThumbnals.length > 0 ? imageThumbnals : null }
                    </div>
                    <button className="upload__button" onClick={() => this.onImageUpload(this.props.images)}>Upload</button>
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
        images: state.images
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFilesDrop: (event) => dispatch({type: actionTypes.IMAGE, event: event}),
        updateImageStore: () => dispatch({type: actionTypes.UPLOAD_IMAGE})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoUpload);