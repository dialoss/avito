import {useState} from "react";
import "./Messenger.scss"
import {Button, Stack, TextField, Typography} from "@mui/material";

const Phrases = [
    'Здравствуйте! У вас сохранился чек о покупке?',
    'Здравствуйте!',
    'Когда можно посмотреть?',
]


export const Messenger = ({item}) => {
    const [message, setMessage] = useState('');

    const send = () => {
        navigator.clipboard.writeText(message).then(() => window.open(item));
        // if (item) sendMessages([{
        //     url: item,
        //     text: message,
        // }])
        // else sendMessages(selected.map(id => ({
        //     url: items[id].url,
        //     text: message,
        // })))
    }

    return (
        <Stack direction={'column'}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <TextField sx={{fontSize: 12, padding: 0, flexGrow: 1}} multiline
                           onChange={e => setMessage(e.target.value)} value={message}
                           size={'small'} variant="outlined" label={'Сообщение'}/>
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