import React, {useState} from 'react';
import {Messenger} from "./Messenger";
import {Map} from "./Map";
import { useSelector, useDispatch } from 'react-redux'
import {Item} from "./Item";

const MainContent = () => {
    const {current} = useSelector(state => state);
    return (
        <div className="right">
            <Map></Map>
            {current && <Item data={current}></Item>}
            <Messenger></Messenger>
        </div>
    );
};

export default MainContent;