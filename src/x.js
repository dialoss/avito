import React, {useCallback, useLayoutEffect, useMemo, useRef, useState} from "react";
import { VariableSizeList as List } from "react-window";
import {ItemPreview} from "./components/ItemPreview";
import {useSelector} from "react-redux";

const Row = ({ data, index, setSize, windowWidth }) => {
    const rowRef = useRef();
    const isEven = index % 2 === 0;
    React.useEffect(() => {
        setSize(index, rowRef.current.getBoundingClientRect().height);
    }, [setSize, index, windowWidth]);

    return (
        <div
            ref={rowRef}
        >
            <ItemPreview key={data.id} data={data}
                         index={index + 1}></ItemPreview>
        </div>
    );
};

export const useWindowResize = () => {
    const [size, setSize] = useState([0, 0]);

    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener("resize", updateSize);
        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
};
export default function XX() {
    const listRef = useRef();
    const items = useSelector(state => state.data.items);

    const sizeMap = useRef({});
    const setSize = useCallback((index, size) => {
        sizeMap.current = { ...sizeMap.current, [index]: size };
        listRef.current.resetAfterIndex(index);
    }, []);
    const getSize = index => sizeMap.current[index] || 50;
    const [windowWidth] = useWindowResize();

    return (
        <List
            ref={listRef}
            height={400}
            width="100%"
            itemCount={items.length}
            itemSize={getSize}
            itemData={items}
        >
            {({ data, index, style }) => (
                <div style={style}>
                    <Row
                        data={data[index]}
                        index={index}
                        setSize={setSize}
                        windowWidth={windowWidth}
                    />
                </div>
            )}
        </List>
    );
}

const styles = {
    row: {
        fontFamily: "system-ui",
        padding: "1em",
        boxSizing: "border-box",
        borderBottom: "1px solid #222"
    }
};
