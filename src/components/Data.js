import React, {useLayoutEffect, useState} from "react";
import {fetchData} from "../api/api";
import './DataFetch.scss'
import {useDispatch, useSelector} from "react-redux";
import {start} from "../downloader";
import {Bounce, toast, ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';
import {Button, Link, ListItem, Stack, TextField, Typography} from "@mui/material";
import {rub, toDate} from "./tools";
import DataList, {ModifiableList} from "./DataList";
import {triggerEvent, useAddEvent} from "../hooks";
import {actions, checkUser, storagePush, useGetStorage} from "../store/app";
import {useForm} from "react-hook-form";
import {HelpButton} from "./DataPage";
import {store} from "../store";
import {Login} from "../App";
import {User} from "./User";

export const DataFetch = () => {
    const items = useSelector(state => state.app.initialData.items);
    const removed = useSelector(state => state.app.removed);
    const [isParsing, setParsing] = useState(false);
    const dispatch = useDispatch();


    function setData(data) {
        dispatch(actions.setData(data));
    }

    useLayoutEffect(() => {
        const d = fetchData();
        if (d) d.then(d => setData(d));
    }, []);
    const [history, setHistory] = useGetStorage('history');

    const startParse = ({url, limit}) => {
        window.ym(96654586, 'reachGoal', 'start');

        if (url && !isParsing && checkUser()) {
            setParsing(true);
            try {
                window.parseLimit = limit;
                dispatch(actions.clear());
                start(url)
                    .then(id => {
                        setParsing(false);
                        if (!id) return;
                        let s = window.location.href.replace(window.location.search, '');
                        s += '?id=' + id;
                        window.history.pushState({}, "", s);
                        const d = {
                            id, url, date: new Date().getTime(),
                            amount: Object.keys(store.getState().app.initialData.items).length
                        };
                        storagePush("history", d);
                        setHistory([...history, d]);
                        triggerEvent('alert', {message: 'Загрузка завершена!', type: 'success', duration: 2000})
                    });
            } catch (e) {
                alert(e)
                setParsing(false);
            }
        }
    };


    const {
        register,
        handleSubmit,
    } = useForm();

    return (
        <>
            <div className={'data-fetch'}>
                <div style={{ display: 'flex', justifyContent:'space-between'}}><Typography variant={'subtitle1'}>Объявлений
                    загружено: {Object.values(items).length}</Typography>
                <div style={{
                    justifyContent: 'end',
                    alignItems: 'center',
                    marginBottom: 10
                }}>
                    <Login></Login></div></div>
                <Typography align={'center'} variant={'subtitle1'}>{isParsing && "Загрузка..."}</Typography>
                <form onSubmit={handleSubmit((data) => startParse(data))}>
                    <Stack spacing={1}>
                        <TextField {...register('url', {required: true})} type={'url'} fullWidth
                                   size={'small'} label={'Сcылка из Авито'} variant="standard"/>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <TextField {...register('limit', {value: 20})}
                                       type={'number'}
                                       size={'small'} label={'Лимит страниц'} variant="standard"/>
                            <Button type={'submit'} variant="contained" onClick={startParse}>Начать</Button>
                        </Stack>
                    </Stack>
                </form>
                {isParsing && <p>Парсинг запущен. Не закрывайте браузер.</p>}
                <div style={{marginTop: 20}}></div>
                <div style={{marginBottom: 20}}><Typography textAlign={'center'}
                                                            style={{fontSize: 14, fontWeight: 700}}>Данные отображаются
                    только для конкретного результата парсинга</Typography>

                </div>
                <ModifiableList title={'Удалённые объявления'}
                                storage={'removed'} add={false} filter={it => removed[it]}
                                listItem={({data}) => <RemovedPreview data={removed[data]}></RemovedPreview>}>
                </ModifiableList>
                <ModifiableList storage={'liked'} add={false} remove={true} filter={it => items[it]}
                                listItem={({data}) => <RemovedPreview data={items[data]}/>}
                                title={'Лайки'}></ModifiableList>

                <DataList title={'История запросов'} list={[...history].reverse()} item={({data, i}) => {
                    let idUrl = window.location.href.replace(window.location.search, '') + "?id=" + data.id;
                    return <ListItem sx={{paddingLeft: 0, columnGap: 1}} divider key={data.id}>
                        <span>{i + 1}.</span>
                        <span style={{display: 'flex', flexDirection: 'column'}}>
                                    <Link href={idUrl} style={{marginBottom: 6}}>Результат {data.id}</Link>
                                    <Link href={data.url}>{data.url}</Link>
                                    <p>Дата {toDate(data.date)}</p>
                                    <p>Количество объявлений {data.amount || "неизвестно"}</p>
                                </span>
                    </ListItem>
                }}></DataList>
                <ModifiableList
                                formatInput={getSellerId}
                                add={false}
                                listItem={({data}) =>
                                    <div>
                                        <User user={data}></User>
                                        <Link target={'_blank'}
                                            href={'https://www.avito.ru' + data.url}>{data.id}</Link>
                                    </div>
                                }
                                sort={(a, b) => b.banned - a.banned}
                                title={'Заблокированные продавцы'}
                                storage={'banned'}></ModifiableList>
                <ModifiableList label={'Слово-фильтр'}
                                title={'Фильтры'}
                                storage={'filters'}></ModifiableList>
                <ModifiableList label={'Фраза'}
                                title={'Фразы в чате'}
                                storage={'phrases'}></ModifiableList>
            </div>

            <div style={{
                bottom: 0,
                right: 0,
                width: '100%',
                position: 'fixed',
            }}>

                <div className="help-section"
                     style={{
                         justifyContent: "space-between",
                         backgroundColor: "#fff",
                         alignItems: 'center',
                         display: 'flex'
                     }}>
                    <p style={{textAlign: 'center', padding: 5}}>Связь с разработчиком <a
                        href="https://t.me/dialoss">Telegram</a></p>
                    <HelpButton pos={{margin: "5px"}}></HelpButton>
                </div>
            </div>
        </>
    )
}

function RemovedPreview({data}) {
    return (
        <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 10}}>
            <p>{data.title}</p>
            <p>{rub.format(data.price)}</p>
            <p>{data.city}</p>
            <p>{toDate(data.timestamp * 1000)}</p>
            <div className="url"><a target={"_blank"} href={data.url}>{data.id}</a></div>
        </div>
    )
}

export function Alerts() {
    useAddEvent('alert', (d) => {
        const {message, type, duration} = d.detail;
        toast(message, {type: type, pauseOnHover: false, autoClose: duration})
    })
    return (
        <ToastContainer
            position="bottom-left"
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            closeButton={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="colored"
            transition={Bounce}></ToastContainer>
    )
}

export function getSellerId(d) {
    let m = d.toString().match(/\/[^\/]{30,40}\//);
    if (m) return m[0].slice(1, -1);
    return '';
}