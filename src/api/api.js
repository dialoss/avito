import {apis} from "../downloader";
import {triggerEvent} from "../hooks";
import {storagePush, storageRemove} from "../store/localStorage";

export function fetchData() {
    const location = new URLSearchParams(new URL(window.location).search).get('id');
    if (location)
        return fetch(`https://res.cloudinary.com/dgkwlszta/raw/upload/${location}.json`)
            .then(r => r.json()).then(d => d);

}

const CLIENT_SECRET = '1YEIDQh_crlmwGWSiBIZF9_s4vPPG4uW7bu91MB8';
const CLIENT_ID = '6KV6ypDjqyB5eVcLhWP5';

class Auth {
    static token = null;

    static async getToken() {
        if (Auth.token) return Auth.token;
        return await apis[1].request('https://api.avito.ru/token', {
            headers: {},
            method:"POST",
            body: new URLSearchParams({
                'client_secret': CLIENT_SECRET,
                'client_id': CLIENT_ID,
                'grant_type': 'client_credentials'
            })
        }, false).then(r => r.json()).then(d => {
            console.log(d)
            Auth.token = d.access_token;
            return Auth.token;
        })
    }
}

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
    const p = apis[0].request(url, {body: data, headers: {}}).then(r => r.json());
    chats[adID] = p;
    return p;
}

export async function sendMessage(message, id) {
    try {
        const token = await Auth.getToken();
        Promise.all([chats[id]]).then(d => {
            const chatID = d[0].result.channelId;
            apis[1].request(`https://api.avito.ru/messenger/v1/accounts/${328145761}/chats/${chatID}/messages`, {
                headers: {
                    'content-type': 'application/json',
                    "Authorization": "Bearer " + token,
                    "Spb-Authorization": "Bearer " + token,
                },
                body: {
                    "message": {
                        "text": message,
                    },
                    "type": "text"
                }
            })
        })
    }
    catch (e) {
        triggerEvent('alert', {message: "Ошибка", type:"error"})
    }
}

export function toggleLike(state, id) {
    let endpoint = state ? 'add' : 'delete';
    apis[1].request('https://www.avito.ru/web/1/favorites/items/' + endpoint, {
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