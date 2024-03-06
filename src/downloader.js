import {fields} from "./config";
import {COOKIE} from "./tools";
import axios from "axios";
import {store} from "./store";
import {actions} from "./store/app";
import {getStorage} from "./store/localStorage";
import {triggerEvent} from "./hooks";

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
        let options = {
            method,
            headers: {
                ...this.headers,
                ...request.headers,
            },
            ...(method === 'POST' ? {body: (stringify ? JSON.stringify(request.body) : request.body)} : {})
        };
        console.log(options)
        return await fetch(this.endpoint + '?' + new URLSearchParams(this.payload), options).catch(er => triggerEvent('alert', {
            type: "error",
            message: message || 'Ошибка',
        }))
    }
}

export const apis = [
    new APIEndpoints(['5c07f7dcd6c19497a4e74a4024e02569', '5f80d75692079dbd82db12cc6ca8e937', 'a0822455a0b96ebfe83740d1283bb65c', '3a5531fd0d5dee79c425990c1216fae9'], 'https://api.scraperapi.com/', {
        'accept': '*/*',
        'X-Cookie': COOKIE
    }, {
        'key': 'api_key',
        'device': 'device_type',
    }, {
        'keep_headers': 'true',
        'device_type': 'mobile'
    }, 'https://api.scraperapi.com/dashboard'),
    new APIEndpoints(['ZLPGY3FA2HNBVFEESROXDFWSFKCD5XGEB13IM4O9WA9LN5UR29HB24A81FTKZO9V3BVFHZLJZ7OU620Q', '59D7K2E2B1ISCMSKC3S5E0NB3EV0XISDYQASX7JHFUZB4N3G2488PEENSQYXKJIDWTEVY1Y7U9XY400U', 'HHIV907F7F8Z6ISNEJVTAE14FIBNFR29G4G3PXSC3U1NVGJURTWTQXMTABWG31CT33V5T5RXTAHEMLY4', '16YWZ71HI7HE89WUDAA9W6V3Z4UYZ743U2H6JXGPP8AJTMGPNUSZ8A0W2XYPIFTR0NFCJO8SQQ3FJBJN', 'Z3QZIYV9WGSTK95PDN9J7SU9T0FKWKS7AK1BWXT2SXE087EXKP3EKQJBEE7TR84XJ30HH9ZFSW77B6W0'], 'https://app.scrapingbee.com/api/v1/', {}, {
        'key': 'api_key',
        'device': 'device',
    }, {
        'render_js': 'false', 'cookies': COOKIE, 'forward_headers': true, 'device': 'desktop',
    }, 'https://app.scrapingbee.com/'),
    new APIEndpoints(['815cfdc4cfa8453fb70bf25bbb03c169', '98155c6a44ab4ec29f6d1a3a23dc9d96', 'da056a6fd38d4c6684b55e67a6bcdab9',
        '70f5df5b924e4c75a47de0d00c728753', '009fce480b8f4c86a2ea7ca76a37e18c'], 'https://api.scrapingant.com/v2/general', {}, {
        'key': 'x-api-key',
        'device': 'device',
    }, {
        'browser': false, 'cookies': COOKIE, 'device': 'dekstop',
    })
];

const endpoints = apis[2].endpoints;
const concurrency = {};
for (let i = 0; i < endpoints.length; i++) concurrency[i] = 0;

async function apiRequest(url) {
    return new Promise(resolve => {
        for (let i = 0; i < endpoints.length; i++) {
            if (concurrency[i] < 3) {
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
                if (concurrency[i] < 3) {
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
    while (!data) {
        await apiRequest(url).then(r => r.text()).then(d => {
            try {
                const str = decodeURIComponent(d.match(/(?<=__initialData__ = ").*?;/)).slice(0, -2);
                data = JSON.parse(str);
            } catch (e) {
            }
        })
        await new Promise(r => setTimeout(r, 300));
    }
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
    constructor(url, mobile, keywords_include = [], keywords_exclude = []) {
        this.url = '';
        this.items = {};
        this.keywords_include = keywords_include;
        this.keywords_exclude = getStorage('filters').concat(keywords_exclude);
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
    return apis[2]
        .request(api + id + "?key=af0deccbgcgidddjgnvljitntccdduijhdinfgjgfjir&action=view", {
            body: {},
            headers: {}
        }, false, true)
        .then(r => r.json())
}