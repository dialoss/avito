import React, {useEffect, useRef, useState} from 'react';
import 'winbox/dist/css/winbox.min.css'; // required
import 'winbox/dist/css/themes/modern.min.css'; // optional
import 'winbox/dist/css/themes/white.min.css'; // optional
import WinBox from 'react-winbox';


const Window = ({title, defaultOpened = false, children}) => {
    const ref = useRef();
    const [opened, setOpened] = useState(defaultOpened);
    const openedRef = useRef();
    openedRef.current = opened;

    useEffect(() => {
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

    return (
        <WinBox
            ref={ref}
            noResize
            noMove
            noClose
            width={200}
            height={50}
            {...(defaultOpened ? {max: true} : {min: true})}
            y='bottom'
            onMaximize={() => setOpened(true)}
            onMinimize={() => setOpened(false)}
            title={title}
        >
            <div>
                {children}
            </div>
        </WinBox>
    );
};

export default Window;