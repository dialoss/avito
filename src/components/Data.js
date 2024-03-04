import React, {useLayoutEffect, useState} from "react";
import {fetchData} from "../api/api";
import './DataFetch.scss'
import {useDispatch, useSelector} from "react-redux";
import {actions, getStorage, setStorage, storagePush, storageRemove} from "../store/app";
import {start} from "../downloader";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';

import {
    Accordion,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    ListItem,
    ListItemText, SnackbarContent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {rub, toDate} from "./tools";
import DataList, {MyAccordion} from "./DataList";
import {MyModal} from "./MyModal";
import {ItemPreview} from "./ItemPreview";
import {triggerEvent, useAddEvent} from "../hooks";
import {User} from "./User";

const s = getStorage('filters');
if (!s.length) setStorage('filters', ['магазин', "store", 'треид', 'трейд', 'опт', "сервис", "skupka", "электроника", 'shop', 'дискаунтер', 'trade', "скупка"]);

export const DataFetch = () => {
    const items = useSelector(state => state.initialData.items);
    const removedItems = useSelector(state => state.removed);

    const [url, setUlr] = useState('');
    const [isParsing, setParsing] = useState(false);
    const [limit, setLimit] = useState(500);
    const dispatch = useDispatch();

    function setData(data) {
        dispatch(actions.setData(data));
    }

    useLayoutEffect(() => {
        const d = fetchData();
        if (d) d.then(d => setData(d));
    }, []);

    const startParse = () => {
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
                        storagePush('history', d);
                        setHistory(h => [...h, d]);
                        triggerEvent('alert', {message:'Загрузка завершена!',type:'success'})
                    });
            } catch (e) {
                alert(e)
                setParsing(false);
            }
        }
    };
    const [removed, setRemoved] = useState(getStorage('removed').filter(it => removedItems[it]));
    const [history, setHistory] = useState(() => getStorage('history'));
    const [filters, setFilters] = useState(() => getStorage('filters'));
    const [w, setw] = useState('');

    return (
        <div className={'data-fetch'}>
            <Typography align={'center'} variant={'subtitle1'}>Объявлений
                загружено: {Object.values(items).length}</Typography>
            <Typography align={'center'} variant={'subtitle1'}>{isParsing && "Загрузка..."}</Typography>
            <Stack spacing={1}>
                <TextField onChange={e => setUlr(e.target.value)} value={url} fullWidth
                           size={'small'} label={'Сcылка из Авито'} variant="standard"/>
                <FormControlLabel control={<Checkbox checked={server} onChange={e => setServer(e.target.checked)}/>}
                                  label="Данные с сервера"/>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <TextField value={limit}
                               type={'number'}
                               onChange={e => setLimit(+e.target.value)}
                               size={'small'} label={'Лимит объявлений'} variant="outlined"/>
                    <Button type={'submit'} variant="contained" onClick={startParse}>Начать</Button>
                </Stack>
            </Stack>
            {isParsing && <p>Парсинг запущен. Не закрывайте браузер.</p>}
            <div style={{marginTop: 20}}></div>
            <DataList title={'Удалённые объявления'} list={removed} item={({it, i}) =>
                <ListItem divider key={it} sx={{pl: 0}}>
                    {removedItems[it] && <RemovedPreview data={removedItems[it]}></RemovedPreview>}
                    <RemoveIcon onClick={() => setRemoved(storageRemove('removed', it))}></RemoveIcon>
                </ListItem>
            }></DataList>
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
            <DataList title={'Фильтры'} list={filters} item={({it, i}) =>
                <ListItem divider key={it} sx={{pl: 0}}>
                    <ListItemText primary={`${i + 1}. ${it}`}/>
                    <RemoveIcon onClick={() => setFilters(storageRemove('filters', it))}></RemoveIcon>
                </ListItem>
            }>
                <Stack direction={'row'}>
                    <TextField onChange={e => setw(e.target.value)} value={w} fullWidth
                               size={'large'} label={'Слово-фильтр'} variant="standard"/>
                    <IconButton className={'h'} onClick={() => {
                        setFilters(storagePush('filters', w));
                        setw('');
                    }}>
                        <AddIcon></AddIcon></IconButton>
                </Stack>
            </DataList>
        </div>

    )
}

function RemovedPreview({data}) {
    return (
        <div style={{display:'flex',flexWrap:'wrap', columnGap:10}}>
            <p>{data.title}</p>
            <p>{rub.format(data.price)}</p>
            <p>{data.city}</p>
            <p>{toDate(data.timestamp * 1000)}</p>
            <div className="url"><a target={"_blank"} href={data.url}>{data.id}</a></div>
        </div>
    )
}

function MyAlert() {
    const { enqueueSnackbar } = useSnackbar();

    useAddEvent('alert', (d) => {
        enqueueSnackbar(d.detail.message, {variant:d.detail.type})
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
        <SnackbarProvider Components={{success:DownloadComplete,error:DownloadComplete}}
                          transitionDuration={300}
                          autoHideDuration={3500} maxSnack={5}>
            <MyAlert></MyAlert>
        </SnackbarProvider>
    );
}
