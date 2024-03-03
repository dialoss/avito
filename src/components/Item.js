import {useEffect, useRef} from "react";
import "./Item.scss";
import {User} from "./User";

export const Item = ({data}) => {
    const ref = useRef();
    useEffect(() => {
        ref.current.style.setProperty("--columns", 3);
    }, []);
    return (
        <div className="content item">
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
                    data.images.map((url, i) => <div key={i} className="image-wrapper">
                        <img src={url} alt=""/>
                    </div>)
                }</div>
            </div>
        </div>
    )
}