import {configureStore} from '@reduxjs/toolkit'
import {reducer as appReducer} from "./app";

export const store = configureStore({
    reducer: {
        app: appReducer,
    }
})

window.store = store