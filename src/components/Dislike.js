import React, {useState} from 'react';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const Dislike = ({callback}) => {
    return (
        <span className={'dislike'} onClick={callback}>
            <ThumbDownAltOutlinedIcon  style={{fontSize:32}}></ThumbDownAltOutlinedIcon>

        </span>);
};

export default Dislike;