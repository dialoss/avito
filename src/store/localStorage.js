import {createSlice} from '@reduxjs/toolkit'
import {useDispatch, useSelector} from "react-redux";
import {store} from "./index";

const storageNames = [
    'removed',
    'filters',
    'phrases',
    'history'
];

const definedStorage = {
    filters: ['магазин', "store", 'треид', 'трейд', 'опт', "сервис", "skupka", "электроника", 'shop', 'дискаунтер', 'trade', "скупка"],
    phrases: [
        'Здравствуйте! У вас сохранился чек о покупке?',
        'Здравствуйте!',
        'Когда можно посмотреть?',
        'TOF сенсор работает?',
        'Сколько держит батарея при обычном использовании?',
    ]
}


function initStore() {
    const initial = {};
    for (const name of storageNames) {
        const st = getStorage(name);
        if (!st.length) setStorageOnly(name, definedStorage[name] || []);
        initial[name] = getStorage(name);
    }
    return initial;
}

export const storageSlice = createSlice({
    name: 'storage',
    initialState: initStore,
    reducers: {
        setField: (state, {payload: {f, data}}) => {
            state[f] = data;
        },
    }
})

export const {actions, reducer} = storageSlice;

export function getStorage(name, defaultValue='[]') {
    if (!localStorage.getItem(name)) {
        localStorage.setItem(name, defaultValue);
    }
    return JSON.parse(localStorage.getItem(name));
}

export function useGetStorage(name) {
    const dispatch = useDispatch();
    const set = (data) => dispatch(actions.setField({f: name, data}));
    const storage = useSelector(state => state.storage[name]);
    return [storage, set];
}

export function setStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
    store.dispatch(actions.setField({f: name, data}))
}

export function setStorageOnly(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

export function storagePush(name, value) {
    let s = getStorage(name);
    s.push(value)
    setStorage(name, s);
    return s;
}

export function storageRemove(name, value) {
    let s = getStorage(name);
    s.splice(s.indexOf(value), 1);
    setStorage(name, s);
    return s
}