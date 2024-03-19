import "./main.scss";
import {isMobileDevice} from "./tools";
import {ItemList} from "./components/ItemList";
import {Windows} from "./components/Windows";
import React, {useEffect, useState} from "react";
import DataPage, {HelpButton, HelpModal} from "./components/DataPage";
import {Alerts} from "./components/Data";

import SendbirdApp from '@sendbird/uikit-react/App';
import '@sendbird/uikit-react/dist/index.css';
import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';

const pubnub = new PubNub({
    publishKey: 'pub-c-56abb064-1e5c-4b82-85c9-35e7bcd797d9',
    subscribeKey: 'sub-c-68182538-8554-45c4-a0d7-81b3f332affd',
    uuid: 'myUniqueUUID'
});

function Chat() {
    const pubnub = usePubNub();
    const [channels] = useState(['test']);
    const [messages, addMessage] = useState([]);
    const [message, setMessage] = useState('');
    const handleMessage = event => {
        const message = event.message;
        console.log(message)
        if (typeof message === 'string' || message.hasOwnProperty('text')) {
            const text = message.text || message;
            addMessage(messages => [...messages, text]);
        }
    };
    const sendMessage = message => {
        if (message) {
            pubnub
                .publish({ channel: channels[0], message })
                .then(() => setMessage(''));
        }
    };
    window.send = sendMessage;
    useEffect(() => {
        const listenerParams = { message: handleMessage }
        pubnub.addListener(listenerParams);
        pubnub.subscribe({ channels });
        return () => {
            pubnub.unsubscribe({ channels })
            pubnub.removeListener(listenerParams)
        }
    }, [pubnub, channels]);
    useEffect(() => {
        const listenerParams = { message: handleMessage }
        pubnub.addListener(listenerParams);
        pubnub.subscribe({ channels });
        return () => {
            pubnub.unsubscribe({ channels })
            pubnub.removeListener(listenerParams)
        }
    }, [pubnub, channels]);
    return <></>
}


function App() {
    return (
        <div className="app">
            <HelpModal></HelpModal>
            <Alerts></Alerts>
            <DataPage></DataPage>
            {isMobileDevice() ? <ItemList></ItemList> :
                <Windows></Windows>}
        </div>
    );
}

export default App;
