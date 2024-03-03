import {fields, getUserAgent} from "./config";
import {COOKIE} from "./tools";
import axios from "axios";
import {parse} from "./api/api";
import {store} from "./store";
import {actions, storagePush} from "./store/app";

function findCoincidence(text, word) {
    let t = text.toLowerCase();
    let w = word.toLowerCase();
    let pattern = new RegExp(w, 'g');
    let found = t.match(pattern);
    if (found || t.includes(w)) {
        return true;
    } else {
        return false;
    }
}

async function getData(url) {
    let data = null;
    let promise;
    if (!window.fromServer) {
        const headers = {
            'accept': '*/*',
            'cookie': COOKIE
        }
        const payload = {
            'api_key': '5c07f7dcd6c19497a4e74a4024e02569',
            'url': url,
            'keep_headers': 'true',
            'device_type': 'desktop'
        }
        let params = "";
        for (const p in payload) params += p + '=' + payload[p] + '&';
        promise = fetch('https://api.scraperapi.com/?' + params, {
            headers,
        })
    } else {
        promise = parse(url);
    }
    await promise.then(r => r.text()).then(d => {
        const str = decodeURIComponent(d.match(/(?<=__initialData__ = ").*?;/)).slice(0, -2);
        data = JSON.parse(str);
    })
    return data;
}

function updateUrl(url, params) {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;

    for (const key in params) {
        searchParams.set(key, params[key]);
    }
    return urlObj.toString();
}

function formatGeo(geo) {
    let n = geo.length;
    return geo.slice(0, Math.min(n, 8));
}

class API {
    constructor(url, mobile, keywords_include = [], keywords_exclude = []) {
        this.url = '';
        this.items = {};
        this.keywords_include = keywords_include;
        this.keywords_exclude = ['магазин', "store", 'треид', 'трейд', 'опт', "сервис", "skupka", "электроника", 'shop', 'дискаунтер', 'trade', "скупка"].concat(keywords_exclude);
        const parts = new URL(url);
        if (mobile) {
            this.url = `https://m.avito.ru${parts.pathname}`;
        } else {
            this.url = `https://www.avito.ru${parts.pathname}`;
        }
        if (parts.search.length) {
            this.url += parts.search;
        }
    }

    api_request(page, _url = null) {
        let request_url = this.url;
        if (_url) {
            request_url = _url;
        } else {
            request_url = updateUrl(request_url, {'p': page});
        }
        return getData(request_url);
    }

    fetch(...args) {
        // TODO: Implement fetch method
    }

    prepare(data) {
        return [];
    }

    get_data(data) {
        for (const d in data) {
            if (d.includes("avito")) {
                return data[d];
            }
        }
    }
}
let socket = new WebSocket("wss://privet123.pythonanywhere.com/parse");

class DesktopAPI extends API {
    async fetch() {
        let p = 1;
        let amount = 0;

        if (window.fromServer) {
            return new Promise((resolve) => {
                socket.onmessage = event => {
                    const d = JSON.parse(event.data);
                    if (d.end) {
                        resolve(d.file);
                        return;
                    }
                    store.dispatch(actions.appendData(d))
                };
                socket.send(JSON.stringify({url: updateUrl(this.url), limit: window.parseLimit}))
            })
        }

        while (true) {
            const json_data = await this.api_request(p);
            const new_items = this.prepare(json_data);
            const items = {}
            for (const it of new_items) {
                this.items[it['id']] = it;
                items[it['id']] = it;
            }
            const d = this.get_data(json_data)["data"];
            const geo = [d['geoMap']['params']['latitude'], d['geoMap']['params']['longitude']];
            this.geo = geo;
            if (!new_items.length || amount >= window.parseLimit) {
                break;
            }
            p += 1;
            amount += new_items.length;
            store.dispatch(actions.appendData({items, geo}));
            await new Promise(r => setTimeout(r, 500));
        }
        return new Promise((resolve) => {
            const data = {
                'geo': this.geo,
                'count': Object.values(this.items).length,
                "items": this.items,
            };
            upload(JSON.stringify(data)).then(id => resolve(id));
        })
    }

    format_field(item, field) {
        const old = item[field];
        if (field === 'badges') {
            if (!item['iva'] || !item['iva']['BadgeBarStep']) {
                return {[field]: []};
            }
            const badges = item["iva"]["BadgeBarStep"][0]["payload"]["badges"].map(b => b['title']);
            return {[field]: badges};
        }
        let dt = old;
        if (!dt) {
            return {[field]: ''};
        }
        if (field === 'sortTimeStamp') {
            return {
                // 'time': DateTime.fromMillis(old).toFormat("dd.MM.yyyy HH:mm:ss"),
                'timestamp': Math.floor(old / 1000)
            };
        }
        if (field === 'urlPath') {
            field = 'url';
            dt = `https://avito.ru${old}`;
        }
        if (field === 'priceDetailed') {
            field = 'price';
            dt = old['value'];
        }
        if (field === 'coords') {
            const lat = formatGeo(old['lat']);
            const lon = formatGeo(old['lng']);
            dt = [lat, lon];
            let city = item["geo"]["geoReferences"];
            if (city.length) {
                city = city[0]["content"];
            } else {
                city = item['geo']['formattedAddress'] || '';
            }
            return {
                'coords': dt,
                'location': old['address_user'],
                'city': city,
            };
        }
        if (field === "images") {
            const images = [];
            for (const img of old) {
                const values = Object.entries(img).map(([k, v]) => [k, eval(k.replace('x', '*'))]);
                values.sort((a, b) => a[1] - b[1]);
                images.push({
                    [values[values.length / 2][0]]: img[values[values.length / 2][0]],
                    [values.slice(-1)[0][0]]: img[values.slice(-1)[0][0]]
                });
            }
            dt = images;
        }
        if (field === 'iva') {
            let closed = item['closedItemsText'].split(' ')[0];
            const info = item['iva']['UserInfoStep'];
            let seller = item['rating'] || {};
            if (seller) {
                seller = {
                    'score_ratings': seller['score'],
                    ...(seller.summary ? {'all_ratings': parseInt(seller['summary'].split(' ')[0])} : {})
                };
            }
            if (closed === 'Нет') {
                closed = 0;
            }
            let name = '';
            try {
                name = info[0]['payload']['profile']['title'];
            } catch (error) {
                name = '';
            }
            let date = '';
            try {
                date = info[2]['payload']['value'].replace('На Авито с ', '');
            } catch (error) {
                date = '';
            }
            return {
                'seller': {
                    'date': date,
                    'name': name,
                    'all_ads': parseInt(closed), ...seller,
                }
            };
        }
        return {[field]: dt};
    }

    process_keywords(item) {
        const text = `${item['title']} ${item['description']} ${item['seller']['name']}`;
        return (this.keywords_include.some(w => findCoincidence(text, w)) || !this.keywords_include.length) &&
            this.keywords_exclude.every(w => !findCoincidence(text, w));
    }

    prepare(data) {
        if (!data) {
            return [];
        }
        const items = this.get_data(data)['data']["catalog"]["items"];
        const prepared_items = [];
        for (const it of items) {
            if (!it['id']) {
                continue;
            }
            let new_item = {};
            for (const f of fields) {
                new_item = {...new_item, ...this.format_field(it, f)};
            }
            if (!this.process_keywords(new_item)) {
                continue;
            }
            prepared_items.push(new_item);
        }
        return prepared_items;
    }
}

async function upload(data) {
    const file = new File([data], (new Date().getTime() * 1000) + ".json", {
        type: "text/plain",
    });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'kbesoya0');
    formData.append('resource_type', 'raw');
    let fileId = '';
    try {
        await axios.post(
            `https://api.cloudinary.com/v1_1/dgkwlszta/raw/upload`,
            formData,
        ).then(r => fileId = r.data.public_id.split('.')[0]);
    } catch (e) {
        console.log(e);
    }
    return fileId;
}

export async function start(url) {
    const dapi = new DesktopAPI(url, false);
    return await dapi.fetch();
}