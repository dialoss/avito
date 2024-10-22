import {triggerEvent} from "../hooks";
import Userfront from "@userfront/toolkit/react";
import {actions, storagePush, storageRemove} from "../store/app";
import {store} from "../store";


export function fetchData() {
    const location = new URLSearchParams(new URL(window.location).search).get('id');
    if (location)
        return fetch(`https://res.cloudinary.com/dgkwlszta/raw/upload/${location}.json`)
            .then(r => r.json()).then(d => d);

}


const BASE_URL = 'https://avito-message.onrender.com/';
// const BASE_URL = 'http://127.0.0.1:8000/';


export class Net {
    static get(endpoint, headers={}) {
        return fetch(BASE_URL + endpoint, {
            headers: {
                ...headers,
                'token': window.user.token || '',
                'uuid': Userfront.user.userUuid,
            }
        })
            .then(r => r.json())
            .catch(er => triggerEvent('alert', {message: 'Ошибка запроса', type: 'error', duration: 2000}));
    }

    static post(endpoint, data) {
        return fetch(BASE_URL + endpoint, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'token': window.user.token || '',
                'uuid': Userfront.user.userUuid,
                'content-type': 'application/json'
            }
        })
            .then(r => r.json())
            .catch(er => triggerEvent('alert', {message: 'Ошибка запроса', type: 'error', duration: 2000}));
    }
}

function setData(d) {
    window.user.data = {...window.user.data, ...d};
    store.dispatch(actions.setUser(window.user.data));
    return d;
}

window.user = {
    data: {},
    update: (data) => Net.post('user', data).then(d => setData(d)),
    get: () => Net.get('user').then(d => setData(d)),
}
Userfront.addInitCallback(() =>
    window.user.get()
        .then(d => store.dispatch(actions.updateData()))
);

window.requests = Net;

export const chats = {};

export async function getChatID(adID) {
    if (chats[adID]) return;
    const p = Net.get("chat?id=" + adID)
    chats[adID] = p;
    return p;
}

export async function sendMessage(message, id) {
    try {
        Promise.all([chats[id]]).then(d => {
            let chatID;
            try {
                chatID = d[0].result.channelId;
            } catch (e) {
                triggerEvent('alert', {message: "Ошибка", type: "error"})
            }
            Net.get(`message?chat=${chatID}&message=${message}`).then(r => {
                if (r.id) triggerEvent('alert', {message: 'Сообщение отправлено', type: "success", duration: 1000});
                else triggerEvent('alert', {message: 'Сообщение не отправлено', type: "error", duration: 1000});
            })
        })
    } catch (e) {
        triggerEvent('alert', {message: "Ошибка", type: "error"})
    }
}

export function toggleLike(state, id) {
    if (state) storagePush('liked', id);
    else storageRemove('liked', id);
}
