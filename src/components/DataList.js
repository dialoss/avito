import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, List, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

const DataList = ({list, title, item, children}) => {
    return (
        <div className="data-list">
           <MyAccordion title={title}>
               <List dense={true} sx={{pl: 0}}>
                   {
                       list.map((it, i) => React.createElement(item, {it, i, key: it}))
                   }
               </List>
               {children}
           </MyAccordion>
        </div>
    );
};

export default DataList;