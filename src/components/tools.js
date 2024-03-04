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
