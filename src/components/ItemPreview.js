import {User} from "./User";

export const ItemPreview = ({index, data}) => {
    return (
        <div className={'item'}>
            <div className="counter">{index}</div>
            <div className="images">
                
            </div>
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

                }</div>
            </div>
        </div>
    )
}