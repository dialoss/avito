import React, {useLayoutEffect, useState} from "react";
import {fetchData} from "../api/api";
import './DataFetch.scss'
import {useDispatch, useSelector} from "react-redux";
import {start} from "../downloader";
import {SnackbarProvider, useSnackbar} from 'notistack';
import Alert from '@mui/material/Alert';

import {Button, Link, ListItem, Stack, TextField, Typography} from "@mui/material";
import {rub, toDate} from "./tools";
import DataList, {ModifiableList} from "./DataList";
import {triggerEvent, useAddEvent} from "../hooks";
import {actions} from "../store/app";
import {useGetStorage} from "../store/localStorage";
import {useForm} from "react-hook-form";

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
        if (url && !isParsing) {
            setParsing(true);
            try {
                window.parseLimit = limit;
                dispatch(actions.clear());
                start(url)
                    .then(id => {
                        let s = window.location.href.replace(window.location.search, '');
                        s += '?id=' + id;
                        window.history.pushState({}, "", s);
                        setParsing(false);
                        const d = {id, url, date: new Date().getTime()};
                        setHistory([...history, d]);
                        triggerEvent('alert', {message: 'Загрузка завершена!', type: 'success'})
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
        <div className={'data-fetch'}>
            <Typography align={'center'} variant={'subtitle1'}>Объявлений
                загружено: {Object.values(items).length}</Typography>
            <Typography align={'center'} variant={'subtitle1'}>{isParsing && "Загрузка..."}</Typography>
            <form onSubmit={handleSubmit((data) => startParse(data))}>
                <Stack spacing={1}>
                    <TextField {...register('url', {required: true})} type={'url'} fullWidth
                               size={'small'} label={'Сcылка из Авито'} variant="standard"/>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <TextField {...register('limit', {value: 500})}
                                   type={'number'}
                                   size={'small'} label={'Лимит объявлений'} variant="standard"/>
                        <Button type={'submit'} variant="contained" onClick={startParse}>Начать</Button>
                    </Stack>
                </Stack>
            </form>
            {isParsing && <p>Парсинг запущен. Не закрывайте браузер.</p>}
            <div style={{marginTop: 20}}></div>
            <ModifiableList title={'Удалённые объявления'}
                            storage={'removed'} add={false} filter={it => removed[it]}
                            listItem={(it) => <RemovedPreview data={removed[it.it]}></RemovedPreview>}>
            </ModifiableList>

            <DataList title={'История'} list={history} item={({it, i}) => {
                let idUrl = window.location.href.replace(window.location.search, '') + "?id=" + it.id;
                return <ListItem sx={{paddingLeft: 0, columnGap: 1}} divider key={it.id}>
                    <span>{i + 1}.</span>
                    <span style={{display: 'flex', flexDirection: 'column'}}>
                                    <Link href={idUrl} style={{marginBottom: 6}}>Результат {it.id}</Link>
                                    <Link href={it.url}>{it.url}</Link>
                                    <p>Дата {toDate(it.date)}</p>
                                </span>
                </ListItem>
            }}></DataList>
            <ModifiableList label={'Слово-фильтр'}
                            title={'Фильтры'}
                            storage={'filters'}></ModifiableList>
            <ModifiableList label={'Фраза'}
                            title={'Фразы в чате'}
                            storage={'phrases'}></ModifiableList>
        </div>

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

function MyAlert() {
    const {enqueueSnackbar} = useSnackbar();

    useAddEvent('alert', (d) => {
        enqueueSnackbar(d.detail.message, {variant: d.detail.type})
    });
    return (
        <></>
    )
}

const DownloadComplete = React.forwardRef((props, ref) => {
    const {message, variant} = props;

    return (
        <Alert ref={ref} severity={variant}>{message}</Alert>
    )
})

export function Alerts() {
    return (
        <SnackbarProvider Components={{success: DownloadComplete, error: DownloadComplete}}
                          transitionDuration={300}
                          autoHideDuration={3500} maxSnack={5}>
            <MyAlert></MyAlert>
        </SnackbarProvider>
    );
}
