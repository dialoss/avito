import {useEffect, useLayoutEffect, useRef, useState} from "react";
import "./main.css";
import {COOKIE, getData, isMobileDevice} from "./tools";
import {ItemList} from "./components/ItemList";
import {Windows} from "./components/Windows";
import "./downloader";
import {DataFetch} from "./components/Data";

function App() {
    return (
        <div className="app">
            <DataFetch></DataFetch>
            {isMobileDevice() ? <ItemList></ItemList> :
            <Windows></Windows>}
        </div>
    );
}

export default App;
