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

class SheetController {
    sheetRef = null;
    prevSelected = null;

    init(data, sheetRef) {
        this.sheetRef = sheetRef;
        const title = {};
        for (const f of tableFields) {
            title[f] = ru[f];
        }
        return [title, ...data.map(it => {
            let d = {};
            for (const f in it)
                d = {...d, ...formatField(f, it[f])};
            let ordered = {};
            for (const f of tableFields) {
                ordered[f] = d[f];
            }
            return ordered;
        })]
    }

    format() {
        const sh = this.sheetRef.current;
        sh.cellFormat({fontWeight:"bold"}, `A2:T2`);
        sh.setRowsHeight(20);
        sh.select = this.select;
    }

    fillRow(row) {
        if (this.prevSelected) {
            this.sheetRef.current.cellFormat({backgroundColor: "#FFF"}, `A${this.prevSelected}:T${this.prevSelected}`);
        }
        this.sheetRef.current.cellFormat({backgroundColor: "#DFD3E6"}, `A${row}:T${row}`);
        this.prevSelected = row;
    }

    select(args) {
        let selected = [];
        let lastRow = 0;
        for (const range of args.range.split(' ')) {
            const row = range.split(':')[0].match(/\d*/g)[1];
            selected.push(this.sheetRef.current.getRowData(+row - 1)[0].id);
            lastRow = +row;
        }
        const lastID = selected.slice(-1);
        this.fillRow(lastRow);
        store.dispatch(actions.setCurrent(lastID));
    }
}

let sheetController = null;

export const Sheet = ({data}) => {
    const spreadsheetRef = useRef(null);
    const [formattedData, setData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const b = document.querySelector("body")
            const x = [...b.children];
            for (const child of x) {
                if (child.classList.length === 0) {
                    b.removeChild(child);
                    break;
                }
            }
        }, 1000);
    }, [data]);

    useLayoutEffect(() => {
        sheetController = new SheetController();
    }, []);

    useLayoutEffect(() => {
        if (!data.length) return;
        setData(sheetController.init(data, spreadsheetRef));
    }, [data]);

    return (
        <div className={'sheet'}>
            {formattedData.length && <SpreadsheetComponent ref={spreadsheetRef} created={() => sheetController.format()}>
                <SheetsDirective>
                    <SheetDirective name={'avito'}>
                        <RangesDirective>
                            <RangeDirective dataSource={formattedData}></RangeDirective>
                        </RangesDirective>
                    </SheetDirective>
                </SheetsDirective>
            </SpreadsheetComponent>}
        </div>
    )
}