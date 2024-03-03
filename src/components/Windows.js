
import 'split-pane-react/esm/themes/default.css';
import {Sheet} from "./Sheet";
import MainContent from "./MainContent";
import {useSelector} from "react-redux";
import Split from 'react-split-it';
import "./Split.scss"

export const Windows = () => {
    const data = useSelector(state => state.data);
    return (
        <div className="windows">
            <Split gutterSize={8}>
                <div className="left">
                    <div className="counter_all">Объявлений: {data.count}</div>
                    <Sheet></Sheet>
                </div>
                <MainContent></MainContent>
            </Split>
        </div>

    )
}