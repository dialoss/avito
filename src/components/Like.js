import {useState} from "react";
import "./Like.scss"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const Like = ({state, callback}) => {
    const [like, setLike] = useState(state);
    return (
        <span onClick={() => {
            setLike(l => !l);
            callback(!like);
        }}>
            {!like ? <FavoriteBorderIcon style={{fontSize:32}}></FavoriteBorderIcon> :
                <FavoriteIcon   style={{fontSize:32,color: 'red'}}></FavoriteIcon>}
        </span>
    )
}
