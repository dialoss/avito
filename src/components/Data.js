import {useLayoutEffect, useState} from "react";
import {parse} from "../api/api";
import './DataFetch.css'
import {useDispatch} from "react-redux";
import {actions} from "../store/app";
import d from "./d.json"

export const DataFetch = () => {
    const [url, setUlr] = useState('');
    const [isParsing, setParsing] = useState(false);
    const dispatch = useDispatch();
    const startParse = () => {
        if (url && !isParsing) {
            setParsing(true);
            console.log(d)
            dispatch(actions.setData(d));
            // parse(url).then(d => {
            //     dispatch(actions.setData(d))
            //     console.log(d)
            // })
            setUlr('');
        }
    };
    return (
        <div className={'data-fetch'}>
            <input type="text" onChange={e => setUlr(e.target.value)} value={url}/>
            <button onClick={startParse}>PARSE</button>
        </div>
    )
}