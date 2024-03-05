import {createSlice} from '@reduxjs/toolkit'
import {getStorage, storagePush} from "./localStorage";

const inital = {
    selected: [],
    current: 0,
    data: {items: []},
    mapSelected: [],
    initialData: {items: {}},
    displayed: [],
    removed: {},
}

export const appSlice = createSlice({
    name: 'app',
    initialState: inital,
    reducers: {
        setField: (state, {payload: {field, data}}) => {
            state[field] = data;
        },
        appendData: (state, {payload: data}) => {
            filterData(data, state.removed);
            const prevItems = {...state.initialData.items};
            const newItems = data.items;
            state.initialData = {...state.initialData, ...data};
            state.initialData.items = {...prevItems, ...newItems};
            state.data = data;
            state.data.items = Object.values(prevItems).concat(Object.values(newItems));
        },
        setData: (state, {payload: data}) => {
            filterData(data, state.removed);
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
        clear: (state) => {
            return inital;
        },
        updateItem: (state, {payload: {data, field}}) => {
            if (!field) {
                state.initialData.items[data.id] = data;
            }
            else {
                state.initialData.items[data.id][field] = data[field];
                state.data.items.forEach((it, i) => {
                    if (it['id'] === data.id) state.data.items[i] = {...state.data.items[i], [field]: data};
                })
            }
        },
        remove: (state, {payload: id}) => {
            state.removed[id] = {...state.initialData.items[id]}
            delete state.initialData.items[id];
            const items = state.data.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i]['id'] === id) {
                    items.splice(i, 1)
                }
            }
        }
    }
})

export const {actions, reducer} = appSlice;


function filterData(data, rm) {
    let removed = getStorage('removed');
    for (const id of removed) {
        if (data.items[id]) {
            rm[id] = {...data.items[id]};
            delete data.items[id];
        }
    }
    for (const id of getStorage('liked')) {
        if (data.items[id]) data.items[id].liked = true;
    }
}