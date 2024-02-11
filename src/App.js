import {useEffect, useLayoutEffect, useRef, useState} from "react";
import "./maps";
import "./main.css";
import SimpleImageSlider from "react-simple-image-slider";

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
let fromExcel = false;
let mapInited = false;

const ItemPreview = ({data}) => {
    return (
        <div className={'item'} data-id={data.id} onClick={() => window.setID(data.id, true)}>
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
                    <p>{data.description}</p>
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
                items.map(it => <ItemPreview key={it.id} data={it}></ItemPreview>)
            }
        </div>
    )
}

function App() {
    const [all, setAll] = useState({});
    const [itemID, setID] = useState(0);
    const [file, setFile] = useState(() => `https://res.cloudinary.com/dgkwlszta/raw/upload/${new URLSearchParams(new URL(window.location).search).get('id')}.json`);
    const [filter, setFilter] = useState([]);

    window.setFilter = setFilter;
    window.setID = (id, excel) => {
        setID(id);
        fromExcel = excel;
        if (prevItem) {
            document.querySelector(`div[data-id="${prevItem}"]`).classList.remove('selected');
        }
        const cur = document.querySelector(`div[data-id="${id}"]`);
        cur.classList.add('selected');
        window.scrollTo({
            top:
                cur.getBoundingClientRect().top -
                document.body.getBoundingClientRect().top
        });
    }
    window.setFile = setFile;
    const item = all[itemID];
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
        window.objectManager.objects.setObjectOptions(itemID, {
            preset: 'islands#redIcon',
            zIndex: 1000,
        });
        prevItem = itemID;
        if (fromExcel) window.myMap.setCenter(item.coords);
    }, [itemID]);
    useEffect(() => {
        try {
            window.initExcel();
        } catch (e) {
        }
    }, []);
    useLayoutEffect(() => {
        if (window.objectManager) {
            window.objectManager.setFilter(function (obj) {
                return filter.find(x => x === obj.id)
            })
        }
    }, [filter]);
    useLayoutEffect(() => {

    }, []);
    return (
        <div className="App">
            <div id="map"></div>
            {item && <Item data={item}></Item>}
            <ItemList items={Object.values(all)}></ItemList>
            <div className="buttons">
                {
                    [1, 2, 3].map(n => <button key={n} id={'col'} onClick={() => {
                        const images = document.querySelector(".images");
                        images.style.setProperty("--columns", n);
                    }}>{n}</button>)
                }
            </div>
        </div>
    );
}

export default App;
