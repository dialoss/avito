import {ItemPreview} from "./ItemPreview";
import {useSelector} from "react-redux";
import {map, Map} from "./Map";
import "./ItemList.scss"
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import Split from 'react-split-it';
import "./Split.scss"
import Window from "./Window";
import {Sheet} from "./Sheet";
import Images, {SimpleViewer} from "./Photos";
import Pages from "./Pages";
import {HelpButton} from "./DataPage";

export const ItemList = () => {
    const current = useSelector(state => state.app.current);
    const items = useSelector(state => state.app.data.items);
    const fetching = useSelector(state => state.app.fetching);
    useLayoutEffect(() => {
        const prev = document.querySelector('.item-preview.selected');
        if (prev) prev.classList.remove('selected');
        const item = document.querySelector(`div[data-id="${current}"]`);
        if (!item) return;
        item.classList.add('selected');
        item.scrollIntoView();
    }, [current]);

    function onSplit(e) {
        setSizes(e);
        if (ref.current) ref.current.style.maxHeight = e[1] * 100 + "dvh"
    }
    useEffect(() => {
        onSplit([0.30, 0.7]);
    }, [])

    const [sizes, setSizes] = useState([]);
    const ref = useRef(null);
    return (
        <div className={'item-list'}>
            {!items.length && <HelpButton id={'secondary-help'} pos={{bottom: 90, right: 10, position:"fixed"}}></HelpButton>}
            <div className="counter_all">{`Объявлений: ${items.length}`}</div>
            <Split gutterSize={10} direction={'vertical'} sizes={sizes} minSize={100} onSetSizes={e => {
                onSplit(e);
                map && map.resize();
            }}>
                <Map></Map>
                <Pages ref={ref} items={items}></Pages>
            </Split>
            <Window title={'EXCEL'} x={'left'} defaultOpened={true}><Sheet></Sheet></Window>
            <Images></Images>
            <SimpleViewer></SimpleViewer>
        </div>
    )
}
