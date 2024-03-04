import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, List, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const DataList = ({list, title, item}) => {
    return (
        <div className="data-list">
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List dense={true} sx={{pl: 0}}>
                        {
                            list.map((it, i) => React.createElement(item, {it, i, key: it}))
                        }
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default DataList;