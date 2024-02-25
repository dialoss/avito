import {useState} from "react";
import {useSelector} from "react-redux";
import {sendMessages} from "../api/api";

export const Messenger = () => {
    const {items, selected} = useSelector(state => state);
    const [message, setMessage] = useState('');

    const send = () => sendMessages(selected.map(id => ({
        url: items[id].url,
        text: message,
    })))

    return (
        <div>
            <input type="text" onChange={e => setMessage(e.target.value)} value={message}/>
            <button id={'send-message'} onClick={send}>Отправить</button>
            {
                ['Здравствуйте! У вас сохранился чек о покупке?', 'Здравствуйте!'].map(m => <div
                    className={'message-suggest'}
                    key={m}
                    onClick={() => setMessage(m)}>
                    {m}
                </div>)
            }
        </div>
    )
}