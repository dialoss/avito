import {getStorage, setStorage, storagePush, storageRemove} from "../store/app";

export function fetchData() {
    const location = new URLSearchParams(new URL(window.location).search).get('id');
    if (location)
        return fetch(`https://res.cloudinary.com/dgkwlszta/raw/upload/${location}.json`)
            .then(r => r.json()).then(d => d);

}

export async function parse(url) {
    let data = null;
    await fetch(`https://privet123.pythonanywhere.com/parse`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({url})
    })
        .then(r => data = r)
        .catch(er => alert(er));
    return data;
}

export function sendMessages(messages) {
    fetch('https://valued-horse-awake.ngrok-free.app/send', {
        method: "POST",
        headers: {
            'ngrok-skip-browser-warning': '1',
            "content-type": "application/json"
        },
        body: JSON.stringify(messages)
    }).catch(er => alert(er))
}

export function toggleLike(state, id) {
    fetch("https://privet123.pythonanywhere.com/like", {
        body: JSON.stringify({
            id, state,
        }),
        method: "POST",
        headers: {
            "content-type": "application/json",
        }
    }).catch(er => alert(er)).then(r => {
        if (state) storagePush('liked', id);
        else storageRemove('liked', id);
    });
}