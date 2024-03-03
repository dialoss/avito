import React, {useState} from 'react';
import {Messenger} from "./Messenger";
import {Map} from "./Map";
import { useSelector, useDispatch } from 'react-redux'
import {Item} from "./Item";

const MainContent = () => {
    const current = useSelector(state => state.current);
    const items = useSelector(state => state.data.items);
    return (
        <div className="right">
            <Map></Map>
            {items[current] && <Item data={items[current]}></Item>}
            <Messenger></Messenger>
        </div>
    );
};

export default MainContent;