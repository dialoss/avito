import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    List,
    ListItem,
    ListItemText,
    Container,
    Button
} from '@mui/material';
import IconButton from "@mui/material/IconButton";
import {useLayoutEffect, useState} from "react";
import _ from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../store/app";

const fields = [
    { label: 'Цена', value: 'price' },
    { label: 'Дата', value: 'timestamp' },
    { label: 'Продавец:объявлений', value: 'seller.all_ads' },
    { label: 'Продавец:рейтинг', value: 'seller.score_ratings' },
];

const labels = {
    price:'Цена',
    timestamp:'Дата',
    "seller.all_ads":'Продавец:объявлений',
    "seller.score_ratings":"Продавец:рейтинг"
}

export const FilterAndSort = () => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.app.data.items);
    const [sortBy, setSortBy] = useState(fields[0].value);
    const [sortOrder, setSortOrder] = useState('asc');
    const handleSortToggle = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    useLayoutEffect(() => {
        dispatch(actions.setVisible([...items].sort((a, b) => {
            let comparison;
            let val1 = _.get(a, sortBy);
            let val2 = _.get(b, sortBy);
            if (val1 === undefined) return -1;
            if (val2 === undefined) return 1;
            if (isNaN(val1)) comparison = val1.localeCompare(val2);
            else comparison = val1 - val2;
            return sortOrder === 'asc' ? comparison : -comparison;
        }).map(it => it.id)));
    }, [items.length, sortOrder, sortBy]);


    return (
        <>
            <FormControl style={{minWidth: '150px' }}>
                <InputLabel style={{marginBottom:20}} id="sort-by-label">Сорт. по {labels[sortBy]}</InputLabel>
                <Select
                    labelId="sort-by-label"
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    {fields.map((field, index) => (
                        <MenuItem key={index} value={field.value}>
                            {field.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <IconButton onClick={handleSortToggle}>
                {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
        </>
    );
};