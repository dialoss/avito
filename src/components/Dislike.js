import React, {useState} from 'react';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import BlockIcon from '@mui/icons-material/Block';
const Dislike = ({callback}) => {
    return (
        <span className={'dislike'} onClick={callback}>
            <ThumbDownAltOutlinedIcon  style={{fontSize:32}}></ThumbDownAltOutlinedIcon>

        </span>);
};

export const Block = ({callback}) => {
    return (
        <span className={'block'} onClick={callback}>
            <BlockIcon  style={{fontSize:32}}></BlockIcon>
        </span>);
}

export default Dislike;