import "./main.scss";
import {isMobileDevice} from "./tools";
import {ItemList} from "./components/ItemList";
import {Windows} from "./components/Windows";
import {DataFetch} from "./components/Data";
import Window from "./components/Window";

function App() {
    return (
        <div className="app">
            <Window min title={'PARSE'}><DataFetch></DataFetch></Window>
            {isMobileDevice() ? <ItemList></ItemList> :
                <Windows></Windows>}
        </div>
    );
}

export default App;
