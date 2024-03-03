import {createSlice} from '@reduxjs/toolkit'

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        selected: [],
        current: 0,
        data: {items: []},
        mapSelected: [],
        initialData: {items: {}},
        displayed: [],
    },
    reducers: {
        setField: (state, {payload: {field, data}}) => {
            state[field] = data;
        },
        appendData: (state, {payload: data}) => {
            filterData(data);
            const prevItems = {...state.initialData.items};
            const newItems = data.items;
            state.initialData = {...state.initialData, ...data};
            state.initialData.items = {...prevItems, ...newItems};
            state.data = data;
            state.data.items = Object.values(prevItems).concat(Object.values(newItems));
        },
        setData: (state, {payload: data}) => {
            filterData(data);
            state.initialData = {...data};
            data.items = Object.values(data.items);
            state.data = data;
        },
        setCurrent: (state, {payload: id}) => {
            state.current = id;
        },
        setSelected: (state, {payload: items}) => {
            state.selected = items;
            state.mapSelected = items;
        },
        setVisible: (state, {payload: items}) => {
            state.data.items = items.map(id => state.initialData.items[id]);
        },
        remove: (state, {payload: id}) => {
            delete state.initialData.items[id];
            const items = state.data.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i]['id'] === id) {
                    items.splice(i, 1)
                }
            }
            storagePush('removed', id);
        }
    }
})

export const {actions, reducer} = appSlice;

function mergeDeep(target, source) {
    const isObject = (obj) => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    Object.keys(source).forEach(key => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue);
        } else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        } else {
            target[key] = sourceValue;
        }
    });

    return target;
}

function filterData(data) {
    let removed = getStorage('removed');
    for (const id of removed) {
        if (data.items[id]) delete data.items[id];
    }
    for (const id of getStorage('liked')) {
        if (data.items[id]) data.items[id].liked = true;
    }
}

export function getStorage(name) {
    if (!localStorage.getItem(name)) {
        localStorage.setItem(name, '[]');
    }
    return JSON.parse(localStorage.getItem(name));
}

export function setStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

export function storagePush(name, value) {
    let s = getStorage(name);
    s.push(value)
    setStorage(name, s);
}

export function storageRemove(name, value) {
    let s = getStorage(name);
    s.splice(s.indexOf(value), 1);
    setStorage(name, s);
    return s
}