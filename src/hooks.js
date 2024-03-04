import {useLayoutEffect} from "react";

export const useAddEvent = (name, callback) => {
    useLayoutEffect(() => {
        window.addEventListener(name, callback)
        return () => window.removeEventListener(name, callback);
    }, [])
}

export const triggerEvent = (name, data) => {
    window.dispatchEvent(new CustomEvent(name, {detail:data}));
}