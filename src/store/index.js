import {configureStore} from '@reduxjs/toolkit'
import {reducer as appReducer} from "./app";

export const store = configureStore({
    reducer: appReducer
})