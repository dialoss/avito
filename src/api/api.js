import {apis} from "../downloader";
import {triggerEvent} from "../hooks";
import {storagePush, storageRemove} from "../store/localStorage";

export function fetchData() {
    const location = new URLSearchParams(new URL(window.location).search).get('id');
    if (location)
        return fetch(`https://res.cloudinary.com/dgkwlszta/raw/upload/${location}.json`)
            .then(r => r.json()).then(d => d);

}

const BASE_URL = 'https://privet123.pythonanywhere.com/';

export class Net {
    static request(endpoint, request={}) {
        return fetch(BASE_URL + endpoint, request)
            .then(r => r.json())
            .catch(er => triggerEvent('alert', {message:'Ошибка запроса',type:'error'}));
    }
}

class Auth {
    static token = null;

    static async getToken() {
        if (Auth.token) return Auth.token;
        return await Net.request('auth').then(d => {
            console.log(d)
            Auth.token = d.access_token;
            return Auth.token;
        })
    }
}

Auth.getToken();

export const chats = {};

export async function getChatID(adID) {
    if (chats[adID]) return;
    let url = "https://socket.avito.ru/fallback?app_name=mav";
    const data = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "avito.chatCreateByItemId.v2",
        "params": {
            "itemId": adID,
            "source": "details-item"
        }
    };
    const p = apis[2].request(url, {body: data, headers: {}}).then(r => r.json());
    chats[adID] = p;
    return p;
}

export async function sendMessage(message, id) {
    const token = await Auth.getToken()
    try {
        Promise.all([chats[id]]).then(d => {
            console.log(d)
            const chatID = d[0].result.channelId;
            Net.request("message", {
                headers: {
                    'content-type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({
                    message,
                    chat: chatID,
                    token,
                })
            }).then(r => {
                if (r.id) triggerEvent('alert', {message: 'Сообщение отправлено', type: "success", duration: 1000});
                else triggerEvent('alert', {message: 'Сообщение не отправлено', type: "error", duration: 1000});
            })
        })
    } catch (e) {
        triggerEvent('alert', {message: "Ошибка", type: "error"})
    }
}

export function toggleLike(state, id) {
    let endpoint = state ? 'add' : 'delete';
    apis[2].request('https://www.avito.ru/web/1/favorites/items/' + endpoint, {
        body: {
            "ids": [id],
            "x": "sralu8yv1l4nhv1m0zrw71p6btcjwmw",
            "fromPage": "catalog"
        },
        headers: {},
    }).catch(er => alert(er)).then(r => {
        if (state) storagePush('liked', id);
        else storageRemove('liked', id);
    });
}

function callback(r) {
    console.log(r)
}

export async function subscribe() {
    let response = await Net.request('messages');
    if (response.statusCode === 200) callback(response);
    else await new Promise(resolve => setTimeout(resolve, 1000));
    await subscribe();
}