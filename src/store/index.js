import {configureStore} from '@reduxjs/toolkit'
import {reducer as appReducer} from "./app";
import {initStore, reducer as storageReducer} from "./localStorage";

export const store = configureStore({
    reducer: {
        app: appReducer,
        storage: storageReducer
    }
})