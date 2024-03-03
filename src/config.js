export const tableFields = ['seller_date', 'seller_name', 'seller_all_ratings',
    'seller_score_ratings', 'seller_all_ads',
    'badges', 'description',
    'title',
    'time', 'price', 'location', 'city','stats_total', 'seller_type', 'stats_today',  'url']

export const ru = {
    'stats_total': "Просмотры всего",
    'stats_today': "Просмотры сегодня",
    'id': 'Айди',
    'reserved': 'Резерв доставка',
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
    'seller_type': "Тип продавца",
    'url': 'Ссылка',
    'city': 'Город',
    'badges': 'Инфо'
}

export const fields = ['id', 'description', 'title', 'iva', 'coords', 'badges', 'sortTimeStamp', 'images', 'urlPath', 'stats', 'priceDetailed'];


let UserAgents = [];
fetch('user-agents.txt').then(r=>r.text()).then(d => UserAgents = d.split('\n').filter(s => s.match(/windows|Macintosh|ubuntu/i)));

export function getUserAgent() {
    return UserAgents[Math.max(0, Math.floor(Math.random() * UserAgents.length) - 1)];
}