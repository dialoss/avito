import {useLayoutEffect, useState} from "react";
import {fetchData, parse} from "../api/api";
import './DataFetch.scss'
import {useDispatch, useSelector} from "react-redux";
import {actions, getStorage, setStorage, storagePush, storageRemove} from "../store/app";
import {start} from "../downloader";

export const DataFetch = () => {
    const items = useSelector(state => state.data.items);
    const [url, setUlr] = useState('');
    const [server, setServer] = useState(false);
    const [isParsing, setParsing] = useState(false);
    const [limit, setLimit] = useState(100);
    const dispatch = useDispatch();

    function setData(data) {
        dispatch(actions.setData(data));
    }

    useLayoutEffect(() => {
        const d = fetchData();
        if (d) d.then(d => setData(d));
    }, []);

    const startParse = async () => {
        if (url && !isParsing) {
            setParsing(true);
            try {
                window.parseLimit = limit;
                window.fromServer = server;
                start(url)
                    .then(id => {
                        let s = window.location.href.replace(window.location.search, '');
                        s += '?id=' + id;
                        window.history.pushState({}, "", s);
                        setParsing(false);
                        storagePush('history', {id, url});
                        setHistory(h => [...h, {id, url}])
                    });
            } catch (e) {
                alert(e)
            }
        }
    };
    const [removed, setRemoved] = useState(() => getStorage('removed'));
    const [history, setHistory] = useState(() => getStorage('history'))
    return (
        <div className={'data-fetch'}>
            <div>Объявлений загружено: {items.length}</div>
            <input className={'input-url'} type="text" onChange={e => setUlr(e.target.value)} value={url}/>
            <div>
                <input type="checkbox" checked={server} onChange={e => setServer(e.target.checked)}/>
                <span>From server</span>
            </div>
            <div>
                <input type="number" value={limit} onChange={e => setLimit(e.target.value)}/>
                <span>Limit</span>
            </div>
            <button onClick={startParse}>Начать</button>
            {isParsing && <p>Парсинг запущен. Не закрывайте браузер.</p>}
            <div className="removed-items list">
                <p>Removed ads</p>
                <ul>
                    {
                        removed.map((rm, i) => <li key={rm} onClick={() => setRemoved(storageRemove('removed', rm))}>
                            <span>{i + 1} {rm}</span>
                        </li>)
                    }
                </ul>
            </div>
            <div className="previous-parse list">
                <p>History</p>
                <ul>
                    {
                        history.map((h, i) => {
                            let idUrl = window.location.href.replace(window.location.search, '') + "?id=" + h.id;
                            return <li key={h.id}>
                                <span>{i + 1}</span>
                                <br/>
                                <a href={idUrl}>{idUrl}</a>
                                <br/>
                                <a href={h.url}>{h.url}</a>
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>

    )
}