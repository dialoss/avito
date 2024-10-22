import React, {useRef, useState} from 'react';
import {Messenger} from "./Messenger";
import {Map} from "./Map";
import { useSelector, useDispatch } from 'react-redux'
import {Item} from "./Item";
import Pages from "./Pages";
import {HelpButton} from "./DataPage";

const MainContent = () => {
    const current = useSelector(state => state.app.current);
    const items = useSelector(state => state.app.data.items);
    const ref = useRef(null);

    return (
        <div className="right">
            <Map></Map>
            <Pages ref={ref} items={items}></Pages>

            {!items.length && <HelpButton id={'secondary-help'} pos={{bottom: 10, right: 10, position:"fixed"}}></HelpButton>}
        </div>
    );
};

export default MainContent;