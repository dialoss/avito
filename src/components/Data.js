import React, {useLayoutEffect, useState} from "react";
import {fetchData} from "../api/api";
import './DataFetch.scss'
import {useDispatch, useSelector} from "react-redux";
import {actions, getStorage, storagePush, storageRemove} from "../store/app";
import {start} from "../downloader";
import RemoveIcon from '@mui/icons-material/Remove';
import {
    Button,
    Checkbox,
    FormControlLabel, Grid, Link,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {toDate} from "./tools";
import DataList from "./DataList";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
export const DataFetch = () => {
    const items = useSelector(state => state.data.items);
    const [url, setUlr] = useState('https://avito.ru/udmurtiya/telefony/mobilnye_telefony/apple/iphone_12_pro-ASgBAgICA0SywA2UgTy0wA3OqzmwwQ2I_Dc?p=1');
    const [server, setServer] = useState(false);
    const [isParsing, setParsing] = useState(false);
    const [limit, setLimit] = useState(400);
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
                window.fromServer = server;
                dispatch(actions.clear());
                start(url)
                    .then(id => {
                        let s = window.location.href.replace(window.location.search, '');
                        s += '?id=' + id;
                        window.history.pushState({}, "", s);
                        setParsing(false);
                        const d = {id, url, date: new Date().getTime()};
                        storagePush('history', d);
                        setHistory(h => [...h, d])
                    });
            } catch (e) {
                alert(e)
                setParsing(false);
            }
        }
    };
    const [removed, setRemoved] = useState(() => getStorage('removed'));
    const [history, setHistory] = useState(() => getStorage('history'));
    const [filters, setFilters] = useState(() => getStorage('filters'));

    return (
        <div className={'data-fetch'}>
            <Typography align={'center'} variant={'subtitle1'}>Объявлений загружено: {items.length}</Typography>
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
            <div style={{marginTop:20}}></div>
            <DataList title={'Удалённые объявления'} list={removed} item={({it, i}) =>
                <ListItem divider key={it} sx={{pl: 0}}>
                    <ListItemText primary={`${i + 1}. ${it}`}/>
                    <RemoveIcon onClick={() => setRemoved(storageRemove('removed', it))}></RemoveIcon>
                </ListItem>
            }></DataList>
            <DataList title={'История'} list={history} item={({it, i}) => {
                let idUrl = window.location.href.replace(window.location.search, '') + "?id=" + it.id;
                return <ListItem sx={{paddingLeft:0, columnGap:1}} divider key={it.id}>
                    <span >{i + 1}.</span>
                    <span style={{display: 'flex', flexDirection: 'column'}}>
                                    <Link href={idUrl} style={{marginBottom: 6}}>Результат {it.id}</Link>
                                    <Link href={it.url}>{it.url}</Link>
                                    <p>Дата {toDate(it.date)}</p>
                                </span>
                </ListItem>
            }}></DataList>
            <DataList title={'Фильтры'} list={filters} item={({it, i}) => {
                return <ListItem sx={{paddingLeft:0, columnGap:1}} divider key={it.id}>
                    <span >{i + 1}.</span>
                </ListItem>
            }}></DataList>
        </div>

    )
}