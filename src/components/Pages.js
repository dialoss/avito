import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ItemPreview} from "./ItemPreview";
import {Button, TablePagination} from "@mui/material";
import {useDispatch} from "react-redux";
import {actions} from "../store/app";
import {accordions} from "./Accordion";

const Pages = React.forwardRef(({items}, ref) => {
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;

    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        dispatch(actions.setField({field: 'displayed', data: currentItems}));
    }, [currentItems]);

    const handlePageClick = (e, page) => {
        const newOffset = (page * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        for (const ac in accordions) {
            accordions[ac](!expanded);
        }
    }, [expanded, currentItems]);

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
                    // sx={{height:20}}
                    rowsPerPageOptions={[1000,500,300,200,100,50,25,10]}
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