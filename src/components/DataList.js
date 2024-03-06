import React, {useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    ListItemText,
    Stack, TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import {storagePush, storageRemove, useGetStorage} from "../store/localStorage";

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

const DataList = ({list, title, item, emptyMessage='Пусто', children}) => {
    return (
        <div className="data-list">
           <MyAccordion title={title}>
               {!!list.length ? <List dense={true} sx={{pl: 0}}>
                   {
                       list.map((it, i) => React.createElement(item, {it, i, key: it.id || it}))
                   }
               </List> : emptyMessage}
               {children}
           </MyAccordion>
        </div>
    );
};

export const ModifiableList = ({title, storage, filter=()=>true, remove=true, add=true, label='', listItem=null}) => {
    const [data, _] = useGetStorage(storage);
    const [w, setw] = useState('');
    const filteredData = data.filter(filter);
    return (
        <DataList title={title} list={filteredData}
                  {...(storage==='removed'?{emptyMessage:'Нет удалённых для данного запроса'}:{})}
                  item={({it, i}) =>
            <ListItem divider key={it} sx={{pl: 0}}>
                {!listItem ? <ListItemText primary={`${i + 1}. ${it}`}/> :
                React.createElement(listItem, {it})}
                {remove && <RemoveIcon onClick={() => storageRemove(storage, it)}></RemoveIcon>}
            </ListItem>
        }>
            {add && <Stack direction={'row'}>
                <TextField onChange={e => setw(e.target.value)} value={w} fullWidth
                           size={'large'} label={label} variant="standard"/>
                <IconButton className={'h'} onClick={() => {
                    storagePush(storage, w);
                    setw('');
                }}>
                    <AddIcon></AddIcon></IconButton>
            </Stack>}
        </DataList>
    );
}

export default DataList;