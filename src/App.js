import {useEffect, useLayoutEffect, useRef, useState} from "react";
import "./maps";
import "./main.css";
import "@fortune-sheet/react/dist/index.css"
import {
    SheetsDirective,
    SheetDirective,
    RangesDirective,
    RangeDirective,
    SpreadsheetComponent
} from '@syncfusion/ej2-react-spreadsheet';
import SplitPane, {Pane} from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';

const User = ({user}) => {
    return (
        <div className={'user'}>
            <p>{user.name}</p>
            <div className="rating">
                <p className={'stars'}>{user.score_ratings}<img
                    src="https://www.avito.ru/dstatic/build/assets/65d72b98834d715d.svg" alt=""/></p>
                <p>{user.all_ratings} отзыв</p>
            </div>
            <p>{user.all_ads} объявлений</p>
            {!!user.type && <p><b>{user.type}</b></p>}
            {!!user.date && <p>На Авито с {user.date}</p>}
            {!!user.reply && <p>{user.reply}</p>}
        </div>
    )
}

const Item = ({data}) => {
    const ref = useRef();
    useEffect(() => {
        ref.current.style.setProperty("--columns", 3);
    }, []);
    return (
        <div className="content">
            <div className="content-top">
                <div className="title">
                    <p>{data.id}</p>
                    <p>{data.title}</p>
                    <p>{window.dayjs(data.timestamp * 1000, 'ru').format("D MMMM YYYY HH:mm", 'ru')}</p>
                </div>
                <div className="url"><a target={"_blank"} href={data.url}>AVITO</a></div>
                <div><p>Город {data.city}</p></div>
                <div><p>{data.location}</p></div>
                <div className={'price'}>
                    <p>{data.price} ₽</p>
                    <p className={'badges'}>{data.badges[0]}</p>
                </div>
                {data.stats && <div className="stats">
                    {data.stats.total} просмотр (+{data.stats.today} сегодня)
                </div>}
                {data.seller && <User user={data.seller}></User>}
            </div>

            <div className="content-bottom">
                <div className="description">
                    <p style={{fontWeight: 700}}>Описание</p>
                    <p>{data.description}</p>
                </div>
                <div className="images" ref={ref}>{
                    data.images.map((url, i) => <div key={i} className="wrapper">
                        <img src={url} alt=""/>
                    </div>)
                }</div>
            </div>
        </div>
    )
}

let prevItem = null;
let fromMap = false;
let mapInited = false;

const ItemPreview = ({index, data}) => {
    return (
        <div className={'item'} data-id={data.id} onClick={() => window.setID(data.id, true)}>
            <div className="counter">{index}</div>
            <div className="container one">
                <div className="title">
                    <p>{data.title}</p>
                    <p>{window.dayjs(data.timestamp * 1000, 'ru').format("D MMMM YYYY HH:mm", 'ru')}</p>
                </div>
                <div><p>{data.city}</p></div>
                <div><p>{data.location}</p></div>
                <div className={'price'}>
                    <p>{data.price} ₽</p>
                    <p className={'badges'}>{data.badges[0]}</p>
                </div>
                {data.stats && <div className="stats">
                    {data.stats.total} просмотр (+{data.stats.today} сегодня)
                </div>}
                {data.seller && <User user={data.seller}></User>}
                <div className="url"><a target={"_blank"} href={data.url}>AVITO</a></div>
            </div>
            <div className="container two">
                <div className="description">
                    <p style={{fontWeight: 700}}>Описание</p>
                    {/*<Accordion>*/}
                    {/*    <AccordionItem header="Описание">*/}
                    <p>{data.description}</p>
                    {/*</AccordionItem>*/}
                    {/*</Accordion>*/}
                </div>
            </div>
            <div className="container img">
                <div className="images">{
                    // <SimpleImageSlider
                    //     width={896}
                    //     height={504}
                    //     images={data.images}
                    //     showBullets={true}
                    //     showNavs={true}
                    // />
                    // data.images.map((url, i) => <div key={i} className="wrapper">
                    //     <img src={url} alt=""/>
                    // </div>)
                }</div>
            </div>
        </div>
    )
}

const ItemList = ({items}) => {
    return (

        <div className={'item-list'}>
            {
                items.map((it, i) => <ItemPreview key={it.id} data={it} index={i + 1}></ItemPreview>)
            }
        </div>
    )
}

const Like = () => {
    return (
        <button className={'button-like'}>
            <svg role="img" aria-hidden="true" data-icon="favorites" viewBox="0 0 24 24">
                <path
                    d="M1.5 9a6.06 6.06 0 0 1 10.53-4.02 6.01 6.01 0 1 1 8.78 8.23l-8.1 8a1 1 0 0 1-1.41 0l-8.1-8A6.27 6.27 0 0 1 1.5 9Zm6-4c-2.15 0-4 1.85-4 4 0 1.1.46 2.06 1.13 2.81L12 19.1l7.4-7.3A4.01 4.01 0 0 0 16.5 5c-1.5.01-2.89.89-3.63 2.2a1 1 0 0 1-1.76-.04A3.98 3.98 0 0 0 7.5 5Z"></path>
            </svg>
            <span>Добавить в избранное</span>
        </button>
    )
}

const table_fields = ['id', 'stats_total', 'seller_type', 'seller_date', 'stats_today', 'seller_name', 'seller_all_ratings',
    'seller_score_ratings', 'seller_all_ads',
    'badges', 'description', 'reserved',
    'title',
    'time', 'price', 'location', 'city', 'url']

const ru = {
    'stats_total': "Просмотры всего",
    'stats_today': "Просмотры сегодня",
    'id': 'Айди',
    'reserved': 'Резерв',
    'description': "Описание",
    'title': 'Заголовок',
    'time': "Время",
    'price': "Цена",
    'location': "Место",
    'address': 'Адрес',
    'coords': 'Координаты',
    'images': 'Изображения',
    'seller_name': 'Имя продавца',
    'seller_date': 'Дата регистрации',
    'seller_score_ratings': "Рейтинг",
    'seller_all_ads': "Объявлений",
    'seller_all_ratings': "Отзывов",
    'seller_type': "Тип",
    'url': 'Ссылка',
    'city': 'Город',
    'badges': 'Инфо'
}

const Buttons = () => {
    return (
        <div className="buttons">
            {
                [1, 2, 3].map(n => <button key={n} id={'col'} onClick={() => {
                    const images = document.querySelector(".images");
                    images.style.setProperty("--columns", n);
                }}>{n}</button>)
            }
        </div>
    )
}
let prevSelected = null;


function formatField(field, value) {
    if (['seller', 'stats'].includes(field)) {
        let n = {};
        for (let x in value)
            n = {...n, [field + "_" + x]: value[x]};
        return n
    }

    if (field === 'badges') {
        for (let b of value) {
            if (b.toLowerCase().match(/цена/))
                return {field: b}
        }
        return {[field]: ''}
    }
    return {[field]: value}
}

const Sheet = ({data, selected}) => {
    const title = {};
    for (const f of table_fields) {
        title[f] = ru[f];
    }
    const formattedData = data.map(it => {
        let d = {};
        for (const f in it)
            d = {...d, ...formatField(f, it[f])};
        let ordered = {};
        for (const f of table_fields) {
            ordered[f] = d[f];
        }
        return ordered;
    })
    useEffect(() => {
        setTimeout(() => {
            const b = document.querySelector("body")
            const x = [...b.children];
            for (const child of x) {
                if (child.classList.length === 0) {
                    b.removeChild(child);
                    break;
                }
            }
        }, 1000);
    }, []);
    const spreadsheetRef = useRef(null);

    function select() {
        let spreadsheet = spreadsheetRef.current;
        if (!spreadsheet) return;

        let selected = [];
        let lastRow = 0;
        for (const range of args.range.split(' ')) {
            const row = range.split(':')[0].match(/\d*/g)[1];
            selected.push(spreadsheet.getRowData(+row - 1)[0].id);
            lastRow = +row;
        }
        if (prevSelected) {
            spreadsheet.cellFormat({backgroundColor: "#FFF"}, `A${prevSelected}:T${prevSelected}`);
        }
        const lastID = selected.slice(-1);
        spreadsheet.cellFormat({backgroundColor: "#DFD3E6"}, `A${lastRow}:T${lastRow}`);
        window.selected = selected;
        window.setSelected(lastID, false);
        prevSelected = lastRow;
    }

    const onCreated = () => {
        let spreadsheet = spreadsheetRef.current;
        if (spreadsheet) {
            spreadsheet.setRowsHeight(20)
            spreadsheet.select = (args) => {
                select(args);
            }
        }
    };

    useLayoutEffect(() => {
        sele
    }, [selected]);

    const [filter, setFilter] = useState([]);
    useLayoutEffect(() => {
        if (window.objectManager) {
            window.objectManager.setFilter(function (obj) {
                return filter.find(x => x === obj.id)
            })
        }
    }, [filter]);

    return (
        <div className={'sheet'}>
            {data.length && <SpreadsheetComponent ref={spreadsheetRef} created={onCreated}>
                <SheetsDirective>
                    <SheetDirective name={'avito'}>
                        <RangesDirective>
                            <RangeDirective dataSource={formattedData}></RangeDirective>
                        </RangesDirective>
                    </SheetDirective>
                </SheetsDirective>
            </SpreadsheetComponent>}
        </div>
    )
}


const Messenger = ({ads}) => {
    const [message, setMessage] = useState('');

    function apiRequest(messages) {
        fetch('http://localhost:80/send', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(messages)
        })
    }

    const sendMessages = () => apiRequest(window.selected.map(id => ({
        url: ads[id].url,
        text: message,
    })))

    return (
        <div>
            <input type="text" onChange={e => setMessage(e.target.value)} value={message}/>
            <button id={'send-message'} onClick={sendMessages}>Отправить</button>
            {
                ['Здравствуйте! У вас сохранился чек о покупке?', 'Здравствуйте!'].map(m => <div
                    className={'message-suggest'}
                    key={m}
                    onClick={() => setMessage(m)}>
                    {m}
                </div>)
            }
        </div>
    )
}

function App() {
    const [all, setAll] = useState({});
    const [selected, setSelected] = useState(0);
    let file = '';
    const location = new URLSearchParams(new URL(window.location).search).get('id');
    if (location)
        file = `https://res.cloudinary.com/dgkwlszta/raw/upload/${location}.json`;
    window.setSelected = (id, _fromMap) => {
        fromMap = _fromMap;
        setSelected(id);
    }

    const item = all[selected];
    useEffect(() => {
        if (!file || mapInited) return;
        mapInited = true;
        fetch(file)
            .then(r => r.json()).then(d => {
            let newItems = {};
            for (const it in d.items) {
                if (d.items[it].id) newItems[it] = d.items[it];
            }
            setAll(newItems);
            window.dispatchEvent(new CustomEvent("data:loaded", {detail: {geo: d.items.geo, items: newItems}}));
        }).catch(er => console.log(er));
    }, [file]);

    useLayoutEffect(() => {
        if (!item) return;
        if (prevItem) {
            window.objectManager.objects.setObjectOptions(prevItem, {
                preset: 'islands#blueIcon',
                zIndex: 1,
            });
        }
        window.objectManager.objects.setObjectOptions(selected, {
            preset: 'islands#redIcon',
            zIndex: 1000,
        });
        prevItem = selected;
        if (!fromMap) window.myMap.setCenter(item.coords);
    }, [selected]);

    const [sizes, setSizes] = useState(['50%', '50%'])
    return (
        <div className="app">
            <SplitPane resizerSize={6} split="vertical" sizes={sizes} onChange={setSizes}>
                <Pane>
                    <div className="left">
                        <div className="counter_all">Объявлений: {Object.values(all).length}</div>
                        <Sheet selected={selected} data={Object.values(all)}></Sheet>
                    </div>
                </Pane>
                <Pane>
                    <div className="right">
                        <div id="map"></div>
                        {item && <Item data={item}></Item>}
                        <Messenger ads={all}></Messenger>
                    </div>
                </Pane>
            </SplitPane>
        </div>
    );
}

export default App;
