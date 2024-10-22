import React, {useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import {storagePush, storageRemove, useGetStorage} from "../store/app";

export const MyAccordion = ({title, children}) => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

const DataList = ({list, title, item, emptyMessage = 'Пусто', children}) => {
    return (
        <div className="data-list">
            <MyAccordion title={title + ' ' + list.length}>
                {!!list.length ? <List dense={true} sx={{pl: 0}}>
                    {
                        list.map((it, i) => React.createElement(item, {data: it, i, key: it.id || it}))
                    }
                </List> : emptyMessage}
                {children}
            </MyAccordion>
        </div>
    );
};

export const ModifiableList = ({
                                   title,
                                   formatInput = (d) => d,
                                   storage,
                                   filter = () => true,
                                    sort = (a, b) => 1,
                                   remove = true,
                                   add = true,
                                   label = '',
                                   listItem = null
                               }) => {
    const [data, _] = useGetStorage(storage);
    const [w, setw] = useState('');
    const filteredData = data.filter(filter).sort(sort);
    return (
        <DataList title={title} list={filteredData}
                  {...(storage === 'removed' ? {emptyMessage: 'Нет удалённых для данного запроса'} : {})}
                  item={({data, i}) =>
                      <ListItem style={{justifyContent:'space-between'}} divider key={data} sx={{pl: 0}}>
                          {!listItem ? <ListItemText primary={`${i + 1}. ${data}`}/> :
                              React.createElement(listItem, {data})}
                          {remove && <RemoveIcon onClick={() => storageRemove(storage, data)}></RemoveIcon>}
                      </ListItem>
                  }>
            {add && <Stack direction={'row'}>
                <TextField onChange={e => setw(e.target.value)} value={w} fullWidth
                           size={'large'} label={label} variant="standard"/>
                <IconButton className={'h'} onClick={() => {
                    console.log(w)
                    let format = formatInput(w);
                    format && storagePush(storage, format);
                    setw('');
                }}>
                    <AddIcon></AddIcon></IconButton>
            </Stack>}
        </DataList>
    );
}

export default DataList;