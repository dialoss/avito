import {useState} from "react";
import "./Messenger.scss"
import {Button, Stack, TextField, Typography} from "@mui/material";
import {sendMessage} from "../api/api";

const Phrases = [
    'Здравствуйте! У вас сохранился чек о покупке?',
    'Здравствуйте!',
    'Когда можно посмотреть?',
    'TOF сенсор работает?',
    'Сколько держит батарея при обычном использовании?'
]


export const Messenger = ({item}) => {
    const [message, setMessage] = useState('');

    const send = () => {
        if (!message) return;
        sendMessage(message, item.id);
    }

    return (
        <Stack direction={'column'}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <TextField sx={{fontSize: 12, padding: 0, flexGrow: 1}} multiline
                           onChange={e => setMessage(e.target.value)} value={message}
                           size={'small'} variant="standard" label={'Сообщение'}/>
                <div>
                    <Button type={'submit'} variant="contained" onClick={send}>Отправить</Button>
                </div>
            </Stack>
            <div>{
                Phrases.map(m => <div
                    className={'message-suggest'}
                    key={m} onClick={() => setMessage(m)}>
                    {m}
                </div>)
            }</div>
        </Stack>
    )
}