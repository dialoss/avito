import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        selected: [],
        current: 0,
        data: {},
        items: {},
    },
    reducers: {
        setData: (state, {payload: data}) => {
            state.data = data;
            state.items = data.items;
        },
        setCurrent: (state, {payload: id}) => {
            state.current = id;
        },
        setSelected: (state, {payload: items}) => {
            state.selected = items;
        }
    }
})

export const { actions, reducer } = appSlice;
