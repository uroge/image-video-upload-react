import React from 'react';

import '../../../sass/components/cards.scss';

const card = (props) => {
    const iconClasses = ['fas', props.iconClass , 'cards__icon'];

    return (
        <div className="cards__card js-upload-image">
            <i className={iconClasses.join(' ')}></i>
            <h5>Upload a {props.fileType}</h5>
        </div>
    );
};



export default card;