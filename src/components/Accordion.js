import React, {useRef, useState} from "react";

import "./Accordion.scss";

export const accordions = {}

export const Accordion = ({id, className, title, callback=()=>{}, children}) => {
    const [active, setActive] = useState(false);
    const content = useRef(null);
    const [height, setHeight] = useState("0px");

    function toggleAccordion(state) {
        if (state === undefined) state = active;
        setActive(!state);
        if (!state) callback();
        setHeight(state ? "0px" : 'auto');
    }
    accordions[id] = (s) => toggleAccordion(s);
    return (
        <div className={"accordion__section"}>
            <div
                className={`accordion ${className} ${active ? "active" : ""}`}
                onClick={e => {
                    e.stopPropagation();
                    toggleAccordion(active);
                }}
            >
                <p className="accordion__title">{title}</p>
                <span style={{marginLeft: "20px"}}>{active ? "-" : "+"}</span>
            </div>
            {active && <div
                ref={content}
                style={{maxHeight: `${height}`}}
                className="accordion__content"
            >
                <div className="accordion__text">{children}</div>
            </div>}
        </div>
    );
}

export default Accordion;
