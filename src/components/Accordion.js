import React, {useRef, useState} from "react";

import "./Accordion.scss";

export const accordions = {}

export const Accordion = ({body, id, className, title, children}) => {
    const [active, setActive] = useState(false);
    const content = useRef(null);
    const [height, setHeight] = useState("0px");

    function toggleAccordion(state) {
        if (!content.current) return;
        if (state === undefined) state = active;
        setActive(!state);
        setHeight(state ? "0px" : `${Math.max(500, content.current.scrollHeight)}px`);
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
            <div
                ref={content}
                style={{maxHeight: `${height}`}}
                className="accordion__content"
            >
                <div className="accordion__text">{body}{children}</div>
            </div>
        </div>
    );
}

export default Accordion;