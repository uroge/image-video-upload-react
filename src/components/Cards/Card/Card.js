import React from 'react';
import {AiTwotoneVideoCamera} from 'react-icons/ai';
import {IoMdImages} from 'react-icons/io';
import '../../../sass/components/cards.scss';

const card = (props) => {
    return (
        <div className="cards__card js-upload-image">
            {props.type === 'video' ? 
            <AiTwotoneVideoCamera className="cards__icon"/> :
            <IoMdImages className="cards__icon"/> }
            <h5>Upload a {props.fileType}</h5>
        </div>
    );
};



export default card;