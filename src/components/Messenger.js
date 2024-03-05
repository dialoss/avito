import {useState} from "react";
import "./Messenger.scss"
import {Button, Stack, TextField} from "@mui/material";
import {chats, sendMessage} from "../api/api";
import {useGetStorage} from "../store/localStorage";



export const Messenger = ({item}) => {
    const [message, setMessage] = useState('');

    const send = () => {
        if (!message) return;
        sendMessage(message, item.id);
    }

    const openChat = () => {
        Promise.all([chats[item.id]]).then(d =>
            window.open("https://m.avito.ru/profile/messenger/channel/" + d[0].result.channelId)
        )
    }

    const [phrases, _] = useGetStorage('phrases');

    return (
        <Stack direction={'column'} className={'messenger'}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <TextField sx={{fontSize: 12, padding: 0, flexGrow: 1}} multiline
                           onChange={e => setMessage(e.target.value)} value={message}
                           size={'small'} variant="standard" label={'Сообщение'}/>
                <Stack direction={'column'} spacing={1}>
                    <Button variant="contained" sx={{fontSize: 12, height: 20}} onClick={send}>Отправить</Button>
                    <Button variant="contained" sx={{fontSize: 12, height: 20}}  onClick={openChat}>Открыть чат</Button>
                </Stack>
            </Stack>
            <div>{
                phrases.map(m => <div
                    className={'message-suggest'}
                    key={m} onClick={() => setMessage(m)}>
                    {m}
                </div>)
            }</div>
        </Stack>
    )
}