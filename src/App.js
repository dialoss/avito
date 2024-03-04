import "./main.scss";
import {isMobileDevice} from "./tools";
import {ItemList} from "./components/ItemList";
import {Windows} from "./components/Windows";
import React from "react";
import DataPage from "./components/DataPage";
import {Alerts} from "./components/Data";
import Window from "./components/Window";
import Chat from "./components/Chat";

function App() {
    return (
        <div className="app">
            <Alerts></Alerts>
            <DataPage></DataPage>
            <Window title={'СООБЩЕНИЯ'}><Chat></Chat></Window>
            {isMobileDevice() ? <ItemList></ItemList> :
                <Windows></Windows>}
        </div>
    );
}

export default App;
