import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import 'winbox/dist/css/winbox.min.css'; // required
import 'winbox/dist/css/themes/modern.min.css'; // optional
import 'winbox/dist/css/themes/white.min.css'; // optional
import WinBox from 'react-winbox';
import {isMobileDevice} from "../tools";


const Window = ({title, defaultOpened = false, callback=() => {}, children}) => {
    const ref = useRef();
    const [opened, setOpened] = useState(defaultOpened);
    const openedRef = useRef();
    openedRef.current = opened;

    useEffect(() => {
        if (!isMobileDevice()) return;
        const win = ref.current.winBoxObj.dom;
        const header = win.querySelector('.wb-drag');
        const clone = header.cloneNode(true);

        header.parentNode.replaceChild(clone, header);
        clone.addEventListener('click', () => openedRef.current ? ref.current.minimize() : ref.current.maximize());
        setTimeout(() => {
            ref.current.minimize();
            for (const el of [...document.querySelectorAll('.winbox')]) el.style.visibility = 'visible';
        }, 100)
    }, []);

    useLayoutEffect(()=>{
        callback(opened);
    }, [opened])

    return (
        <WinBox
            ref={ref}
            {...(isMobileDevice() ? {
                noMove: true,
                noResize: true,
                width:200,
                height:50
            } : {})}
            noAnimation
            background={"#1976D2"}
            noClose
            {...(defaultOpened ? {max: true} : {min: true})}
            y='bottom'
            onMaximize={() => setOpened(true)}
            onMinimize={() => setOpened(false)}
            title={title}
            >
            {children}
        </WinBox>
    );
};

export default Window;