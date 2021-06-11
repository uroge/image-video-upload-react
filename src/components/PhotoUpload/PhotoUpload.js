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

class PhotoUpload extends Component {
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
    onImageDrop = async (event) => {
        event.preventDefault();
        const acceptedImages = [...event.dataTransfer.files];        

        const modifiedImages = [];

        acceptedImages.forEach(async (image) => {
                if(image.type.startsWith('image/')) {
                    modifiedImages.push(Object.assign(image, {
                        preview: URL.createObjectURL(image)
                    }));
                } else {
                    alert('File type not supported!');
                }
        });

        this.props.onFilesDrop(modifiedImages);
        this.setState({isDragOver: false});
    }

    /**
     * Function that creates url for every image
     * and sends images to database
     * @param {Array} images - array of images from the store
    */
    onImageUpload = (images) => {
        this.setState({isLoading: true});
        if(images.length > 0) {
            images.forEach(async (image) => {
                const storageRef = app.storage().ref(`images/`);
                const fileRef = storageRef.child(image.name);
    
                await fileRef.put(image);
                const fileUrl = await fileRef.getDownloadURL();

                const imageData = {
                    preview: fileUrl,
                    name: image.name,
                    lastModifiedDate: image.lastModifiedDate,
                    type: image.type
                }
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

    /**
     * Function that sets isUploadSuccessful to false
     * and closes the modal 
    */
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
            { this.state.isUploadSuccessful ? <Modal show={this.state.isUploadSuccessful} modalClosed={this.modalCloseHandler}>
                Images Uploaded Successfully
            </Modal> : null }
            <section className="upload">
                <div className={`upload__content${ this.state.isDragOver ? ' upload__dragover' : '' }`} 
                    onDragLeave={ this.onDragLeave } 
                    onDragOver={ (event) => this.onDragOver(event)}
                    onDrop={(event) => this.onImageDrop(event)} >
                        
                    { imageThumbnals.length === 0 && this.state.isLoading === false ? 
                        <div>
                            <AiOutlineCloudUpload className="upload__icon"/>
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
        onFilesDrop: (images) => dispatch({type: actionTypes.IMAGE, images: images}),
        updateImageStore: () => dispatch({type: actionTypes.UPLOAD_IMAGE})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoUpload);