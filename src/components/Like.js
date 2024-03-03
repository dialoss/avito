import {useLayoutEffect, useState} from "react";
import "./Like.scss"
export const Like = ({state, callback}) => {
    const [like, setLike] = useState(state);
    return (
        <button className={'button-like ' + (like ? "liked" : '')} onClick={() => {
            setLike(l => !l);
            callback(!like);
        }}>
            <svg role="img" aria-hidden="true" data-icon="favorites" viewBox="0 0 24 24">
                <path stroke={'transparent'}
                    d="M1.5 9a6.06 6.06 0 0 1 10.53-4.02 6.01 6.01 0 1 1 8.78 8.23l-8.1 8a1 1 0 0 1-1.41 0l-8.1-8A6.27 6.27 0 0 1 1.5 9Zm6-4c-2.15 0-4 1.85-4 4 0 1.1.46 2.06 1.13 2.81L12 19.1l7.4-7.3A4.01 4.01 0 0 0 16.5 5c-1.5.01-2.89.89-3.63 2.2a1 1 0 0 1-1.76-.04A3.98 3.98 0 0 0 7.5 5Z"></path>
            </svg>
        </button>
    )
}
