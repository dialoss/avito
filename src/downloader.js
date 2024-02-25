const config = require('./config');

const COOKIE = `srv_id=TCmflpPFYAY8up7K.ceQESsA3URijhiYDtztQ1JHVFT7gYQkJW2aapQk4_1-TOlkaudMjsdKBDzJmNWyb0W4i.YsZQW2JyeiCFdjqcO98rX5ThxEiZRTeufbqR6WX_lzs=.web; u=32clqkl1.1dky9pt.50ivln74a4o0; _gcl_au=1.1.1340078535.1707409664; _ga=GA1.1.1948975290.1707409664; advcake_track_id=a7548162-a94a-edb0-7203-c3a1b59e5794; advcake_session_id=4900e0c9-1ae1-7893-7e33-45dd1b39451e; tmr_lvid=be303b91488a2102f1f86aa83faaead9; tmr_lvidTS=1707409664137; _ym_uid=1707409665735950825; _ym_d=1707409665; uxs_uid=fd4712d0-c69e-11ee-b89b-013382dbb465; adrcid=A_iugnZey_MLBrHXYvoAAWw; __zzatw-avito=MDA0dBA=Fz2+aQ==; auth=1; __upin=6LvkOXxGs83E+PSs5tLjRQ; gMltIuegZN2COuSe=EOFGWsm50bhh17prLqaIgdir1V0kgrvN; cto_bundle=cAg6y19CY2Z5Ulh6QWtiSU1qVGYzR053Tjl0T0hiR1QyeUZSWnJoUFhKY0clMkZuNU9aTk1La1lNQmFxJTJCUzNFQlVDUlRGY3ExSHlTVHlYbG9tSDdzZ3lmSDJjS0ZkOHhrcEJCMmpaMEZ0Vm5Za1p1V1VCJTJCZGNzaWdTbENXRWtIOWN3dW1VNlZCSUlyJTJGZ2JsQURqNW81cGdvNGZKQSUzRCUzRA; f=5.4198df0bc2467d02745ec4009441408047e1eada7172e06c47e1eada7172e06c47e1eada7172e06c47e1eada7172e06cb59320d6eb6303c1b59320d6eb6303c1b59320d6eb6303c147e1eada7172e06c8a38e2c5b3e08b898a38e2c5b3e08b890df103df0c26013a7b0d53c7afc06d0b2ebf3cb6fd35a0ac0df103df0c26013a8b1472fe2f9ba6b9ad42d01242e34c7968e2978c700f15b6831064c92d93c3903815369ae2d1a81d4e0d8a280d6b65f00df103df0c26013aba0ac8037e2b74f9268a7bf63aa148d20df103df0c26013a8b1472fe2f9ba6b97b0d53c7afc06d0b71e7cb57bbcb8e0f03c77801b122405c03c77801b122405c03c77801b122405c2ebf3cb6fd35a0ac20f3d16ad0b1c546b892c6c84ad16848a9b4102d42ade879dcb5a55b9498f6426672eec7841ccb75295f5742a783c86ce00ac7c2eb037b06cd07685c47ac153317c7721dca45217bf62a8377a52635fbc31436e90afb3244e2415097439d404746b8ae4e81acb9fa786047a80c779d5146b8ae4e81acb9fa8e31dbdaf7ad6c884938c41efda3055a2da10fb74cac1eabb3ae333f3b35fe91de6c39666ae9b0d7312f8fecc8ca5e543486a07687daa291; ft="/U6aVYw5eLa++J54zv7hIkdO+s6v3vj/SWZuwhPyQOvt8MuwA8JsjjRz+ph3Cyv8dt/18c2JetF50ruxlniW5Be6Se6N4MHD45I9NWLiazFbQepNGjLJjAODwWb6S3PRMtHS9k4gXKDmYdQLFJT1fyowO3fWkVYU2Ar465SwDaL4l9MUnkXLzOw0f19wd2Kd"; _ga_ZJDLBTV49B=GS1.1.1708718858.4.0.1708718859.0.0.0; _ga_WW6Q1STJ8M=GS1.1.1708718858.4.0.1708718859.0.0.0; buyer_location_id=653240; luri=sankt-peterburg; buyer_laas_location=653240; _ym_isad=2; cfidsw-avito=QYuX5dMWAtcyXFq0CqQxne5hLHOqyLjCnTmJs4vwMd44FRo/VGWE+BpMWJSF5RSKKXkJ912dWcU9/Fq7TgS0z2VxeJUbAmqZ7byvjQA7L4t94Z03bhrEZwSlW+xJIBlTc0NzmaxY5EpYQB7IYB2c/OVLBq/yH188chUViQ==; sessid=b5f8c4970db17ada1d57adc2e4db2734.1708796181; v=1708799237; sx=H4sIAAAAAAAC%2F1TMQbLaMAwA0Lt4nYVkx7LMbWzJamgohBIcGiZ374qZzwXe2xERiSayTDnSSLml2kLWFEEkaXant%2Bvu5Cws3CeFJ4H0Pft0DuXX79xb2Xad0Q2uuRMmYGb2kY7BVSwqBrHCyCgKXIIkpGZjlhatfuR2xuU2Tc9OO%2B73NCfyeodFN%2F9vJSs%2FZIie4jE4JTCygiVHrGap1jiOKBGtiURtH5njtPi1W53PN4T2p%2FkrT48NAsw1AH%2FLzMfgmoCV1pQ8%2BmQcooIP4pE5lTSCfOQL%2BH1beXnka3ldL%2FuKVZfx9XebI3TRbznRcfwPAAD%2F%2F0WJO3ZpAQAA; dfp_group=7; isLegalPerson=0; _ym_visorc=b; _mlocation=621540; _mlocation_mode=default; _ga_M29JC28873=GS1.1.1708801011.15.1.1708801860.55.0.0; cartCounter=0; tmr_detect=0%7C1708801863000`
const fields = ['id', 'description', 'title', 'iva', 'coords', 'badges', 'sortTimeStamp', 'images', 'urlPath', 'stats', 'priceDetailed'];
const table_fields = ['id', 'stats_total', 'stats_today', 'seller_name', 'seller_date', 'seller_all_ratings', 'seller_score_ratings', 'seller_all_ads', 'seller_type', 'badges', 'description', 'reserved', 'title', 'time', 'price', 'location', 'city', 'url'];
const ru = {
    'stats_total': "Просмотры всего",
    'stats_today': "Просмотры сегодня",
    'id': 'Айди',
    'reserved': 'Резерв',
    'description': "Описание",
    'title': 'Заголовок',
    'time': "Время",
    'price': "Цена",
    'location': "Место",
    'address': 'Адрес',
    'coords': 'Координаты',
    'images': 'Изображения',
    'seller_name': 'Имя продавца',
    'seller_date': 'Дата регистрации',
    'seller_score_ratings': "Рейтинг",
    'seller_all_ads': "Объявлений",
    'seller_all_ratings': "Отзывов",
    'seller_type': "Тип",
    'url': 'Ссылка',
    'city': 'Город',
    'badges': 'Инфо'
};

const IP_BAN_SLEEP = 20;


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
    await fetch(url,{
        headers: {
            'cookie': COOKIE,
            'User-Agent': config.getUserAgent()
        }
    }).then(r => r.text()).then(d => {
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

function formatGeo(geo){
    let n = geo.length;
    return geo.slice(0, Math.min(n, 8));
}

class API {
    constructor(url, mobile, keywords_include = [], keywords_exclude = []) {
        this.url = '';
        this.items = {};
        this.keywords_include = keywords_include;
        this.keywords_exclude = ['магазин', "store", 'опт', "сервис", "skupka", "электроника", 'shop', 'дискаунтер', 'trade', "скупка"].concat(keywords_exclude);
        const parts = new URL(url);
        if (mobile) {
            this.url = `https://m.avito.ru${parts.pathname}`;
        } else {
            this.url = `https://www.avito.ru${parts.pathname}`;
        }
        if (parts.search.length) {
            this.url += '?' + parts.search;
        }
    }

    async api_request(page, _url = null) {
        
        let request_url = this.url;
        if (_url) {
            request_url = _url;
        } else {
            request_url = updateUrl(request_url, { 'p': page });
        }
        return await getData(request_url);        
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

class MobileAPI extends API {
    fetch_detailed(items) {
        let s = 0;
        let retries = 0;
        for (const it of Object.values(items)) {
            try {
                const data = this.api_request(0, it['url']);
            } catch (error) {
                continue;
            }
            let item = null;
            while (!item) {
                if (retries === 5) {
                    return;
                }
                try {
                    item = this.prepare(data);
                } catch (error) {
                    
                    time.sleep(IP_BAN_SLEEP);
                    retries += 1;
                }
            }
            const id = it['id'];
            this.items[id] = item;
            if (items[id]) {
                items[id]['seller'] = item['seller'] | items[id].get('seller', {});
                items[id]['stats'] = item['stats'];
                items[id]['reserved'] = item['reserved'];
            }
            if (s === 10) {
                s = 0;
                em.emit('send_result', excel, 'intermediate.xlsx');
            }
            time.sleep(1);
            s += 1;
        }
    }

    prepare(data) {
        const item = this.get_data(data)['buyerItem'];
        const info = item['seller'];
        const stats = item['viewStat'];
        const d = info['tenureSince'];
        return {
            'seller': {
                'type': info['isCompany'] ? "Магазин" : 'Частное лицо',
                'name': info['name'],
                // 'date': DateTime.fromISO(d).toFormat("MM.yyyy") || '',
                'reply': info['replyTimeText']
            },
            'stats': {
                'total': stats['totalViews'],
                'today': stats['todayViews'],
            },
            'reserved': item['item']['deliveryInfo']['isReserved']
        };
    }
}

class DesktopAPI extends API {
    async fetch() {
        let p = 1;

        while (true) {
            const json_data = await this.api_request(p);
            const new_items = this.prepare(json_data);
            for (const it of new_items) {
                this.items[it['id']] = it;
            }
            const d = this.get_data(json_data)["data"];
            this.items['geo'] = [d['geoMap']['params']['latitude'], d['geoMap']['params']['longitude']];
            if (!new_items.length) {
                break;
            }
            p += 1;
            console.log(p, new_items)
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    format_field(item, field) {
        const old = item[field];
        if (field === 'badges') {
            if (!item['iva'] || !item['iva']['BadgeBarStep']) {
                return { [field]: [] };
            }
            const badges = item["iva"]["BadgeBarStep"][0]["payload"]["badges"].map(b => b['title']);
            return { [field]: badges };
        }
        let dt = old;
        if (!dt) {
            return { [field]: '' };
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
                images.push(img[values[Math.floor(values.length / 2)][0]]);
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
                    // 'all_ratings': parseInt(seller['summary'].split(' ')[0]),
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
                // date = DateTime.fromISO(info[2]['payload']['value'].replace('На Авито с ', '')).toFormat("MM.yyyy");
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
        return { [field]: dt };
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
                new_item = { ...new_item, ...this.format_field(it, f) };
            }
            if (!this.process_keywords(new_item)) {
                continue;
            }
            prepared_items.push(new_item);
            
        }
        return prepared_items;
    }

    get_items_count(data) {
        const d = this.get_data(data)["data"];
        const geo = [d['geoMap']['params']['latitude'], d['geoMap']['params']['longitude']];
        this.items['geo'] = geo;
        const on_page = d['itemsOnPageMainSection'];
        const total = d['mainCount'];
        if (on_page === 50 && total > 50) {
            return total;
        }
        return on_page;
    }
}

let items = [];
let dapi = null;
let mapi = null;

async function start(url, detailed, ...args) {
    if (!detailed) {
        dapi = new DesktopAPI(url, false, ...args);
        await dapi.fetch();
        items = dapi.items;
    } else {
        mapi = new MobileAPI(url, false, ...args);
        mapi.fetch_detailed(items);
    }
    console.log(dapi.items);
}

// window.start = start;

// start("https://www.avito.ru/sankt-peterburg/telefony/mobilnye_telefony/apple/iphone_13_pro-ASgBAgICA0SywA3uvcgBtMANzqs5sMENiPw3?cd=1&f=ASgBAQICBESywA3uvcgBtMANzqs5sMENiPw38ooOpIKUAQFA6OsOJPj92wL6_dsC&user=1", false);

function main(args) {
    let keywords_include = [];
    let keywords_exclude = [];
    let deep = false;
    let url = '';
    for (const arg of args) {
        if (arg.includes('https')) {
            url = arg;
        } else if (arg.includes('-')) {
            keywords_exclude.push(arg.replace('-', ''));
        } else if (arg.includes('+')) {
            keywords_include.push(arg.replace('+', ''));
        } else if (arg === 'deep') {
            deep = true;
        }
    }
    return start(url, false, keywords_include, keywords_exclude);
}

