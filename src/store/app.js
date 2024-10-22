import {createSlice} from '@reduxjs/toolkit'
import {useDispatch, useSelector} from "react-redux";
import Userfront from "@userfront/toolkit/react";

const inital = {
    selected: [],
    banned: [],
    current: 0,
    data: {items: []},
    mapSelected: [],
    initialData: {items: {}},
    displayed: [],
    removed: {},
    liked: [],
    user: {},
}

export const appSlice = createSlice({
    name: 'app',
    initialState: inital,
    reducers: {
        setUser: (state, {payload: data}) => {
            state.user = {...state.user, ...data};
        },
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
        updateData: (state) => {
            filterData(state.initialData, state.removed);
            let data = {...state.initialData};
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
            return {...inital, user: state.user};
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
    for (const id of getStorage('removed')) {
        if (data.items[id]) {
            rm[id] = {...data.items[id]};
            delete data.items[id];
        }
    }
    for (const id of getStorage('liked')) {
        if (data.items[id]) data.items[id].liked = true;
    }
    for (const seller of getStorage('banned')) {
        for (const id in data.items) {
            if (data.items[id].seller.url.includes(seller.id)) {
                delete data.items[id];
            }
        }
    }
}

export function getStorage(name) {
    return JSON.parse(window.user.data[name] || '[]');
}

export function setStorage(name, data) {
    window.user.update({[name]: JSON.stringify(data)});
    window.store.dispatch(actions.setUser({[name]: JSON.stringify(data)}));
    window.user.data[name] = JSON.stringify(data);
}

export function useGetStorage(name) {
    const dispatch = useDispatch();
    const set = (data) => dispatch(actions.setUser({[name]: JSON.stringify(data)}));
    const storage = useSelector(state => JSON.parse(state.app.user[name] || '[]'));
    return [storage, set];
}

export function checkUser() {
    let user = !!Userfront.user.userUuid;
    if (!user) window.login();
    return user;
}

export function storagePush(name, value) {
    if (!checkUser()) return;
    let s = getStorage(name);
    if (s.includes(value)) return s;
    s.push(value)
    setStorage(name, s);
    return s;
}

export function storageRemove(name, value) {
    if (!checkUser()) return;
    let s = getStorage(name);
    s.splice(s.indexOf(value), 1);
    setStorage(name, s);
    return s
}