
import {useLayoutEffect, useState} from "react";
import "./Messenger.scss"
import {Button, Stack, TextField} from "@mui/material";
import {chats, sendMessage} from "../api/api";
import {useGetStorage} from "../store/app";


export const Messenger = ({item, close}) => {
    const [message, setMessage] = useState('');

    const send = () => {
        if (!message) return;
        close()
        sendMessage(message, item.id);
        window.ym(96654586, 'reachGoal', 'sendmessage');
        setMessages(m => [...m, {text: message, direction: 'out', id: new Date().getTime()}])
    }

    const openChat = () => {
        close()
        window.ym(96654586, 'reachGoal', 'openchat');
        Promise.all([chats[item.id]]).then(d =>
            window.open("https://m.avito.ru/profile/messenger/channel/" + d[0].result.channelId)
        )
    }

    const [messages, setMessages] = useState([]);
    useLayoutEffect(() => {
        Promise.all([chats[item.id]]).then(d =>
            window.requests.get('messages?chat=' + d[0].result.channelId)
                .then(d => setMessages(d.messages.filter(m => m.type !== 'system').map(m => ({id: m.created,text: m.content.text, direction: m.direction})).reverse()))
        )
    }, [])

    const [phrases, _] = useGetStorage('phrases');

    return (
        <Stack direction={'column'} className={'messenger'}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <TextField sx={{fontSize: 12, padding: 0, flexGrow: 1}} multiline
                           onChange={e => setMessage(e.target.value)} value={message}
                           size={'small'} variant="standard" label={'Сообщение'}/>
                <Stack direction={'column'} spacing={1}>
                    <Button variant="contained" sx={{fontSize: 12, height: 20}} onClick={send}>Отправить</Button>
                    <Button variant="contained" sx={{fontSize: 12, height: 20}} onClick={openChat}>Открыть чат</Button>
                </Stack>
            </Stack>
            <div>{
                phrases.map(m => <div
                    className={'message-suggest'}
                    key={m} onClick={() => setMessage(mess => mess ? (mess + ' ' + m) : m)}>
                    {m}
                </div>)
            }</div>
            {!messages.length && <p>Нет сообщений</p>}
            <div style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                rowGap: 5,
            }}>
                {
                    messages.map(m => <div key={m.id + m.text} style={{
                        width: '100%',
                        display: 'flex',
                    }}>
                        <div style={{
                            borderRadius: 6,
                            boxShadow: '0 0 2px 0 grey',
                            padding: 2,
                            width:'70%',
                            marginLeft: m.direction === 'in' ? '0' : 'auto'
                        }}>
                            <p>{m.text}</p>
                        </div>
                    </div>)
                }
            </div>
        </Stack>
    )
}