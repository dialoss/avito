import {User} from "./User";
import Accordion, {accordions} from "./Accordion";
import {Messenger} from "./Messenger";
import {Like} from "./Like";
import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Navigation, Pagination, Scrollbar, Thumbs} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {useRef} from "react";
import {getChatID, toggleLike} from "../api/api";
import {useDispatch} from "react-redux";
import {actions, storagePush} from "../store/app";
import {store} from "../store";
import Dislike, {Block} from "./Dislike";
import {rub, toDate} from "./tools";
import {triggerEvent} from "../hooks";
import {getSellerId} from "./Data";


export const ItemPreview = ({index, data}) => {
    const ref = useRef(null);

    function dislike(e) {
        e.stopPropagation();
        storagePush('removed', data.id);
        store.dispatch(actions.remove(data.id));
    }

    function block(e) {
        e.stopPropagation();
        storagePush('banned', {...data.seller, id: getSellerId(data.seller.url), banned: new Date().getTime()});
        store.dispatch(actions.updateData());
    }


    const dispatch = useDispatch();

    function select() {
        dispatch(actions.setSelected([data.id]));
    }

    return (
        <div className={'item-preview'} ref={ref} data-id={data.id}
             onMouseDown={select}>
            <div className="like-wrapper">
                <div className="counter">{index}</div>
                <Block callback={block}></Block>
                <Dislike callback={dislike}></Dislike>
                <Like state={data.liked} callback={(state) => toggleLike(state, data.id)}></Like>
            </div>
            <div className="item-preview__container">
                <div className="wrapper">
                    <p className={'title'}>{data.title}</p>
                    <p className="price">{rub.format(data.price)}</p>
                    {data.badges[0] && <p className={'badges'}>{data.badges[0]}</p>}
                    {data.seller && <User user={data.seller}></User>}
                    <p className={'city'}>{data.city}</p>
                    <p className="time">{toDate(data.timestamp * 1000)}</p>
                    <div className="url"><a target={"_blank"} href={data.url}>{data.id}</a></div>
                    <div className="url"><a target={"_blank"}
                                            href={"https://www.avito.ru" + data.seller.url}>Профиль</a></div>
                </div>
                <div className="images">
                    <Swiper
                        pagination={{
                            type: 'fraction',
                        }}
                        modules={[Navigation, Pagination, Scrollbar, Thumbs, A11y]}
                        navigation
                        loop={true}
                        speed={120}
                        spaceBetween={0}
                        slidesPerView={1}
                        onTouchStart={select}
                    >
                        {
                            data.images.map((im, i) => <SwiperSlide key={i}>
                                <div className={'swiper__image-wrapper'}>
                                    <img src={Object.values(im)[0]} alt=""
                                         onClick={() => triggerEvent('images:open', {
                                             images: data.images,
                                             start: i,
                                             id: data.id
                                         })}/></div>
                            </SwiperSlide>)
                        }
                    </Swiper>
                </div>
            </div>
            <Accordion id={data.id} className={'description'} title={'Описание'}>
                {data.description}
            </Accordion>
            <Accordion id={"message" + data.id} className={'contact'}
                       callback={() => getChatID(data.id)}
                       title={'Связаться'}>
                {<Messenger close={() => accordions['message' + data.id](true)} item={data}></Messenger>}
            </Accordion>
        </div>
    )
}