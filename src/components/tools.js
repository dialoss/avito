import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

export function toDate(timestamp) {
    if (!timestamp) return '';
    return dayjs(timestamp).format("D MMMM YYYY HH:mm")
}