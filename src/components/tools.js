import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

export function toDate(timestamp) {
    if (!timestamp) return '';
    return dayjs(timestamp).format("D MMMM YYYY HH:mm")
}

export const rub = Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: "RUB",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

export function getImages(data) {
    let images = [];
    for (let img of data) {
        let values = Object.keys(img).map(k => [k, eval(k.replace('x', '*'))]);
        values.sort((a, b) => a[1] - b[1]);
        let middleIndex = Math.floor(values.length / 3);
        let lastIndex = values.length - 1;
        let imageObj = {};
        imageObj[values[middleIndex][0]] = img[values[middleIndex][0]];
        imageObj[values[lastIndex][0]] = img[values[lastIndex][0]];
        images.push(imageObj);
    }
    return images;
}