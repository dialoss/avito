import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {
    RangeDirective,
    RangesDirective,
    SheetDirective,
    SheetsDirective,
    SpreadsheetComponent
} from "@syncfusion/ej2-react-spreadsheet";
import {actions} from "../store/app";
import {store} from "../store";
import {ru, tableFields} from "../config";
import {formatField} from "../tools";
import {useSelector} from "react-redux";

class SheetController {
    sheetRef = null;
    prevSelected = null;

    init(data, sheetRef) {
        this.sheetRef = sheetRef;
        return data.map(it => {
            let d = {};
            for (const f in it)
                d = {...d, ...formatField(f, it[f])};
            let ordered = {id: it.id};
            for (const f of tableFields) {
                ordered[ru[f]] = d[f];
            }
            return ordered;
        })
    }

    format() {
        if (!this.sheetRef) return;
        const sh = this.sheetRef.current;
        sh.cellFormat({fontWeight: "bold"}, `A1:T1`);
        sh.setRowsHeight(20);
        sh.setColumnsWidth(150, ['H']);
        sh.setColumnsWidth(1, ['A']);
        sh.select = (args) => this.select(args);
        sh.applyFilter([{field: "H", predicate: '', operator: 'notequal', value: ''}]);
    }

    fillRow(row) {
        if (this.prevSelected) {
            this.sheetRef.current.cellFormat({backgroundColor: "#FFF"}, `A${this.prevSelected}:T${this.prevSelected}`);
        }
        this.sheetRef.current.cellFormat({backgroundColor: "#DFD3E6"}, `A${row}:T${row}`);
        this.prevSelected = row;
    }

    select(args) {
        const sh = this.sheetRef.current;
        let selected = [];
        let r = args.range.split(':');
        let start = +r[0].match(/\d*/g)[1];
        let end = +r[1].match(/\d*/g)[1];
        let activeSheet = sh.getActiveSheet();

        for (let i = start; i <= end; i++) {
            const r = (activeSheet.rows[i - 1]);
            if (!r) continue;
            let filteredRow = r.isFiltered;
            if (filteredRow) continue;
            let d = sh.getRowData(i - 1);
            if (!d || isNaN(d[0].id)) continue;
            selected.push(d[0].id);
        }
        if (!selected.length) return;
        const lastID = selected.slice(-1)[0];
        this.fillRow(end);
        store.dispatch(actions.setCurrent(lastID));
        store.dispatch(actions.setVisible(selected));
    }
}

let sheetController = new SheetController();
window.sh = sheetController

export const Sheet = () => {
    const data = useSelector(state => state.initialData.items);
    const spreadsheetRef = useRef(null);
    const [formattedData, setData] = useState([]);

    useLayoutEffect(() => {
        const bannerRemove = setInterval(() => {
            const b = document.querySelector("body")
            const x = [...b.children];
            for (const child of x) {
                if (child.classList.length === 0) {
                    b.removeChild(child);
                    clearInterval(bannerRemove);
                    return;
                }
            }
        }, 50);
    }, [data]);


    useEffect(() => {
        const items = Object.values(data);
        if (!items.length) return;
        setData(sheetController.init(items, spreadsheetRef));
    }, [data]);

    useEffect(() => {
        setTimeout(() => {
            if (sheetController.sheetRef) {
                sheetController.format();
            }
        }, 200);
    }, [formattedData])

    return (
        <div className={'sheet'}>
            <SpreadsheetComponent
                ref={spreadsheetRef}
                allowSave={true}>
                <SheetsDirective>
                    <SheetDirective name={'avito'}>
                        <RangesDirective>
                            <RangeDirective dataSource={formattedData}></RangeDirective>
                        </RangesDirective>
                    </SheetDirective>
                </SheetsDirective>
            </SpreadsheetComponent>
        </div>
    )
}