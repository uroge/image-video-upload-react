import React from 'react';
import { Link } from 'react-router-dom';

import '../../sass/components/cards.scss';
import Card from './Card/Card';

const cards = (props) => (
    <React.Fragment>
        <section className="heading">
            <h1>Upload a Photo or a Video</h1>
        </section>
        <section className="cards">
            <Link to="/photo-upload" className="Link">
                <Card fileType="photo" iconClass="fa-image"/>
            </Link>
            <Link to="/video-upload" className="Link">
                <Card fileType="video" iconClass="fa-video"/>
            </Link>
        </section>
    </React.Fragment>
);

export default cards;