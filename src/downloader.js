import {fields} from "./config";
import axios from "axios";
import {store} from "./store";
import {actions, getStorage} from "./store/app";
import {triggerEvent} from "./hooks";
import dayjs from "dayjs";

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


class APIEndpoints {
    constructor(keys = [], endpoint = '', headers = {}, fieldNames = {}, payload = {}, site = "") {
        this.keys = keys;
        this.endpoints = keys.map(key => new Endpoint(endpoint, key, fieldNames, payload, headers));
        this.apiCounter = 0;
    }

    request(url, request = {body: {}, headers: {}}, stringify = true, message = '') {
        return this.endpoints[(this.apiCounter++) % this.endpoints.length].request(url, request, stringify, message);
    }
}

class Endpoint {
    constructor(endpoint, key, fieldNames, payload, headers) {
        this.key = key;
        this.endpoint = endpoint;
        this.fieldNames = fieldNames;
        this.payload = payload;
        this.headers = headers;
    }

    async request(url, request = {body: {}, headers: {}}, stringify = true, mobile = false, message = '') {
        this.payload[this.fieldNames['key']] = this.key;
        this.payload[this.fieldNames['device']] = mobile ? 'mobile' : 'desktop';
        this.payload['url'] = url;
        const l = Object.values(request.body).length;
        const method = request.method || (l ? 'POST' : 'GET');
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 15000);
        let options = {
            method,
            headers: {
                ...this.headers,
                ...request.headers,
            },
            ...(method === 'POST' ? {body: (stringify ? JSON.stringify(request.body) : request.body)} : {}),
            signal: controller.signal
        };

        let cnt = 0;
        const f = async () => {
            if (cnt >= 3) return;
            const url = this.endpoint + '?' + new URLSearchParams(this.payload);
            const r = await fetch("https://innopolisuniversity.pythonanywhere.com/parse", {
                method: "POST",
                body: JSON.stringify({
                    url: url,
                    cookie: window.user.data.cookie
                }),
                headers: {
                    "content-type": "application/json"
                }
            }).then(r => r.json());
            clearTimeout(id);
            cnt++;
            console.log(r)
            if (r.status !== 200) return await f();
            return r.content;
        }
        return await f();
    }
}


export const apis = [
    new APIEndpoints([
        'b6e199ecbd33b4a85452be1fe9cac05d',
        '3125a4ab9a119b5af9590665b17c8121'], 'https://api.scraperapi.com/', {
        'accept': '*/*',
    }, {
        'key': 'api_key',
        'device': 'device_type',
    }, {
        'keep_headers': 'true',
        'device_type': 'mobile'
    }, 'https://api.scraperapi.com/dashboard'),
];

const endpoints = apis[0].endpoints;
const concurrency = {};
for (let i = 0; i < endpoints.length; i++) concurrency[i] = 0;

const LIMIT = 1;

async function apiRequest(url) {
    return new Promise(resolve => {
        console.log({...concurrency})
        for (let i = 0; i < endpoints.length; i++) {
            if (concurrency[i] < LIMIT) {
                concurrency[i] += 1;
                endpoints[i].request(url).then(d => {
                    concurrency[i] -= 1;
                    resolve(d);
                });
                return
            }
        }
        const waiter = setInterval(() => {
            for (let i = 0; i < endpoints.length; i++) {
                if (concurrency[i] < LIMIT) {
                    concurrency[i] += 1;
                    clearInterval(waiter)
                    endpoints[i].request(url).then(d => {
                        concurrency[i] -= 1;
                        resolve(d);
                    });
                    return
                }
            }
        }, 200);
    })
}

async function getData(url) {
    let data = null;
    await apiRequest(url).then(d => {
        try {
            console.log(d)
            const str = decodeURIComponent(d.match(/(?<=__initialData__ = ").*?;/)).slice(0, -2);
            data = JSON.parse(str);
        } catch (e) {
        }
    })

    console.log('done')
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
    constructor(url, mobile) {
        this.url = '';
        this.items = {};
        this.keywords_include = [];
        this.keywords_exclude = getStorage('filters');
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

class DesktopAPI extends API {
    add(items) {
        this.total += Object.values(items).length;
        store.dispatch(actions.appendData({items, geo: this.geo}));
    }

    async fetch() {
        let initData;
        try {
            initData = await this.api_request(1)
        } catch (e) {
            triggerEvent('alert', {message: 'Ошибка', type: 'error'})
            return;
        }
        const items = await this.prepare(initData);
        const d = this.get_data(initData)["data"];
        const on_page = d['itemsOnPageMainSection']
        const total = d['mainCount']
        let ads;
        if (on_page === 50 && total > 50) ads = total;
        else ads = on_page;
        const pages = Math.min(Math.floor(ads / 50) + 1, window.parseLimit);
        console.log('PAGES', pages, window.parseLimit, total)

        this.add(items);

        const tasks = [];
        for (let p = 2; p <= pages; p++) {
            if (this.total > window.parseLimit) break;
            tasks.push(this.api_request(p).then(data => {
                this.add(this.prepare(data));
            }));
        }
        return Promise.all(tasks).then(() => {
            const data = {
                'geo': this.geo,
                'count': Object.values(this.items).length,
                "items": this.items,
            };
            console.log(data)
            return upload(JSON.stringify(data));
        });
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
                date: dayjs(Math.floor(old)).format("D MMMM YYYY HH:mm"),
                timestamp: Math.floor(old / 1000)
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
            console.log(item)
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
            }
            let url = '';
            try {
                url = info[0]['payload']['profile']['link']
            } catch (e) {
            }
            let date = '';
            try {
                date = info[2]['payload']['value'].replace('На Авито с ', '');
            } catch (error) {
            }
            return {
                'seller': {
                    'date': date,
                    'name': name,
                    'all_ads': parseInt(closed), ...seller,
                    'url': url
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
        let prepared = {};
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
            this.items[it['id']] = new_item;
            prepared[it['id']] = new_item;
        }
        const d = this.get_data(data)['data'];
        this.geo = [d['geoMap']['params']['latitude'], d['geoMap']['params']['longitude']];
        return prepared;
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

export function fetchDetails(id) {
    const api = `https://m.avito.ru/api/19/items/`;
    return apis[0]
        .request(api + id + "?key=af0deccbgcgidddjgnvljitntccdduijhdinfgjgfjir&action=view", {
            body: {},
            headers: {}
        }, false, true)
        .then(r => r.json())
}