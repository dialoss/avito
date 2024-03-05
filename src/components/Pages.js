import React, {useEffect, useLayoutEffect, useState} from 'react';
import {ItemPreview} from "./ItemPreview";
import {Button, TablePagination} from "@mui/material";
import {useDispatch} from "react-redux";
import {actions} from "../store/app";
import {accordions} from "./Accordion";
import $ from 'jquery';

let prevPage = null;

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
            accordions[ac](!expanded);
        }
    }, [expanded, currentItems]);

    useEffect(() => {
        const view = $('.items');
        // if (prevPage < page) view.stop().animate({ scrollTop: 0 }, 200);
        // if (prevPage > page) view.stop().animate({ scrollTop: 10000}, 200);
    }, [page]);

    return (
        <div className="items" ref={ref}>
            {!!currentItems.length && <Button id={'expand'}
                                              variant="contained"
                                              onClick={() => setExpanded(e => !e)}>
                <p>{expanded ? 'Скрыть' : "Показать"} описания</p>
            </Button>}
            <div className="items-inner">
                {
                    currentItems.map((it, i) => <ItemPreview key={it.id} data={it}
                                                             index={itemOffset + i + 1}></ItemPreview>)
                }
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