
import 'split-pane-react/esm/themes/default.css';
import {Sheet} from "./Sheet";
import MainContent from "./MainContent";
import {useSelector} from "react-redux";
import Split from 'react-split-it';
import "./Split.scss"
import {useState} from "react";
import {map} from "./Map";

export const Windows = () => {
    const data = useSelector(state => state.app.data);
    const [sizes, setSizes] = useState([0.5, 0.5]);

    return (
        <div className="windows">
            {/*<Split gutterSize={10} direction={'horizontal'} sizes={sizes} minSize={300} onSetSizes={e => {*/}
            {/*    setSizes(e);*/}
            {/*    console.log(e)*/}
            {/*    map && map.resize();*/}
            {/*}}>*/}
                <div className="left">
                    <div className="counter_all">Объявлений: {data.count}</div>
                    <Sheet></Sheet>
                </div>
                <MainContent></MainContent>
            {/*</Split>*/}
        </div>

    )
}