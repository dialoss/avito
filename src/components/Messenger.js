import {useState} from "react";
import "./Messenger.scss"
const Phrases = [
    'Здравствуйте! У вас сохранился чек о покупке?',
    'Здравствуйте!',
    'Когда можно посмотреть?',
]


export const Messenger = ({item}) => {
    const [message, setMessage] = useState('');

    const send = () => {
        window.open(item)
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
        <div>
            <input type="text" onChange={e => setMessage(e.target.value)} value={message}/>
            <button id={'send-message'} onClick={send}>Отправить</button>
            {
                Phrases.map(m => <div
                    className={'message-suggest'}
                    key={m}
                    onClick={() => {
                        setMessage(m);
                        navigator.clipboard.writeText(m);
                    }}>
                    {m}
                </div>)
            }
        </div>
    )
}