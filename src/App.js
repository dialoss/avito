import "./main.scss";
import {isMobileDevice} from "./tools";
import {ItemList} from "./components/ItemList";
import {Windows} from "./components/Windows";
import React, {useEffect, useState} from "react";
import DataPage, {HelpButton, HelpModal} from "./components/DataPage";
import {Alerts} from "./components/Data";

function App() {
    return (
        <div className="app">
            <HelpModal></HelpModal>
            <Alerts></Alerts>
            <DataPage></DataPage>
            {isMobileDevice() ? <ItemList></ItemList> :
                <Windows></Windows>}
        </div>
    );
}

export default App;
