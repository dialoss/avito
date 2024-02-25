

export async function parse(url) {
    let data = null;
    await fetch(`https://opossum-wanted-mammal.ngrok-free.app/parse?url=${url}`, {
        headers: {
            'ngrok-skip-browser-warning': '1'
        }
    }).then(r => r.json()).then(d => fetch(d.file)).then(r => r.json()).then(d => data = d);
    return data;
}

export function sendMessages(messages) {
    fetch('https://valued-horse-awake.ngrok-free.app/send', {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(messages)
    })
}