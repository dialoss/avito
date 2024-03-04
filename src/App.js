import "./main.scss";
import {isMobileDevice} from "./tools";
import {ItemList} from "./components/ItemList";
import {Windows} from "./components/Windows";
import React from "react";
import DataPage from "./components/DataPage";

function App() {
    return (
        <div className="app">
            <DataPage></DataPage>
            {isMobileDevice() ? <ItemList></ItemList> :
                <Windows></Windows>}
        </div>
    );
}

export default App;
