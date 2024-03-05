import "./main.scss";
import {isMobileDevice} from "./tools";
import {ItemList} from "./components/ItemList";
import {Windows} from "./components/Windows";
import React, {useEffect} from "react";
import DataPage from "./components/DataPage";
import {Alerts} from "./components/Data";


function App() {
    return (
        <div className="app">
            <Alerts></Alerts>
            <DataPage></DataPage>
            {isMobileDevice() ? <ItemList></ItemList> :
                <Windows></Windows>}
        </div>
    );
}

export default App;
