import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ItemPreview} from "./ItemPreview";
import {Button, TablePagination} from "@mui/material";
import {useDispatch} from "react-redux";
import {actions} from "../store/app";
import {accordions} from "./Accordion";
import 'hiding-header/dist/style.css'
import {FilterAndSort} from "./Filters";
import {isMobileDevice} from "../tools";

let prevPage = null;

const Header = ({children}) => {
    const position = useRef(0);
    const [visible, setVisible] = useState(true);
    const ref = useRef();
    useEffect(() => {
        const el = ref.current.parentElement;
        const handleScroll = () => {
            let moving = el.scrollTop;
            setVisible(position.current > moving);
            position.current = moving;
        };
        el.addEventListener("scroll", handleScroll);
        return (() => {
            el.removeEventListener("scroll", handleScroll);
        })
    }, [])

    return (<header className={visible ? "visible" : "hidden"} ref={ref}>
        {children}
    </header>)
}

const Pages = React.forwardRef(({items}, ref) => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;

    const currentItems = items.slice(itemOffset, endOffset);
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        dispatch(actions.setField({field: 'displayed', data: currentItems}));
    }, [currentItems]);

    const handlePageClick = (e, p) => {
        if (!prevPage) prevPage = p;
        setPage(p)
        const newOffset = (p * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        for (const ac in accordions) {
            if (!ac.includes('message')) accordions[ac](!expanded);
        }
    }, [expanded, currentItems]);

    useLayoutEffect(() => {
        const view = document.querySelector(".items");
        view.scrollTop = 0;
    }, [page]);

    let columns = isMobileDevice() ? 1 : 3;
    let l = Math.ceil(currentItems.length / columns);

    return (
        <div className="items" ref={ref}>
            {!!currentItems.length && <Header>
                <Button id={'expand'}
                                                  variant="contained"
                                                  onClick={() => setExpanded(e => !e)}>
                    <p>{expanded ? '-' : "+"} описания</p>
                </Button>
                <FilterAndSort></FilterAndSort>
            </Header>}
            <div className="items-inner">
                <div className="items-columns">
                    {
                        Array(columns).fill(0).map((_, j) => <div key={j} className={'column'} style={{width: 100 / columns + "%"}}>
                            {currentItems.slice(j, Math.min((j + 1) * l, currentItems.length))
                                .map((it, i) => <ItemPreview key={it.id} data={it}
                                                             index={itemOffset + i + 1}></ItemPreview>)}
                        </div>)
                    }
                </div>

            </div>
            <div className="pagination">
                <TablePagination
                    labelRowsPerPage={'Показывать'}
                    component="div"
                    rowsPerPageOptions={[100, 50, 30, 20, 10]}
                    count={items.length}
                    page={Math.floor(itemOffset / itemsPerPage)}
                    onPageChange={handlePageClick}
                    rowsPerPage={itemsPerPage}
                    onRowsPerPageChange={e => setItemsPerPage(e.target.value)}
                />
            </div>
        </div>
    );
});

export default Pages;