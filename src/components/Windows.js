import SplitPane, {Pane} from "split-pane-react";
import {useState} from "react";
import 'split-pane-react/esm/themes/default.css';
import {Sheet} from "./Sheet";
import MainContent from "./MainContent";
import {useSelector} from "react-redux";

export const Windows = () => {
    const {data, items} = useSelector(state => state);
    const [sizes, setSizes] = useState(['50%', '50%'])

    return (
        <SplitPane resizerSize={6} split="vertical" sizes={sizes} onChange={setSizes}>
            <Pane>
                <div className="left">
                    <div className="counter_all">Объявлений: {data.count}</div>
                    <Sheet data={Object.values(items)}></Sheet>
                </div>
            </Pane>
            <Pane>
                <MainContent></MainContent>
            </Pane>
        </SplitPane>
    )
}