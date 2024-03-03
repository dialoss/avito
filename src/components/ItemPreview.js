import {User} from "./User";
import Accordion, {accordions} from "./Accordion";
import {Messenger} from "./Messenger";
import {Like} from "./Like";
import {Swiper, SwiperSlide} from "swiper/react";
import {Thumbs} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper/modules';
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {toggleLike} from "../api/api";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../store/app";
import {store} from "../store";

const rub = Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: "RUB",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

export const ItemPreview = ({index, data}) => {
    const ref = useRef(null);
    function dislike(e) {
        e.stopPropagation();
        store.dispatch(actions.remove(data.id));
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
                <button className={'dislike'} onClick={dislike}>--</button>
                <Like state={data.liked} callback={(state) => toggleLike(state, data.id)}></Like>
            </div>
            <div className="item-preview__container">
                <div className="wrapper">
                    <p className={'title'}>{data.title}</p>
                    <p className="price">{rub.format(data.price)}</p>
                    {data.badges[0] && <p className={'badges'}>{data.badges[0]}</p>}
                    {data.seller && <User user={data.seller}></User>}
                    <p className={'city'}>{data.city}</p>
                    <p className="time">{new Date(data.timestamp * 1000).toLocaleDateString({month: 'long'})}</p>
                    <div className="url"><a target={"_blank"} href={data.url}>{data.id}</a></div>
                </div>
                <div className="images" >
                    <Swiper
                        pagination={{
                            type: 'fraction',
                        }}
                        modules={[Navigation, Pagination, Scrollbar, Thumbs, A11y]}
                        navigation
                        loop={true}
                        spaceBetween={0}
                        slidesPerView={1}
                        onTouchStart={select}
                    >
                        {
                            data.images.map((im, i) => <SwiperSlide key={i}>
                                <div className={'swiper__image-wrapper'}>
                                    <img src={Object.values(im)[0]} alt=""
                                         onClick={() => window.openViewer(data.images, i)}/></div>
                            </SwiperSlide>)
                        }
                    </Swiper>
                </div>
            </div>
            <Accordion id={data.id} className={'description'} body={data.description} title={'Описание'}></Accordion>
            <Accordion className={'contact'} body={<Messenger item={data.url}></Messenger>}
                       title={'Связаться'}></Accordion>
        </div>
    )
}