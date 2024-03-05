import React, {useEffect, useRef, useState} from 'react';

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Lightbox, {createModule, useLightboxState} from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {Button} from "@mui/material";
import {triggerEvent, useAddEvent} from "../hooks";
import {getImages} from "./tools";
import {fetchDetails} from "../downloader";
import {store} from "../store";
import {actions} from "../store/app";

let itemID = null;

const Preview = ({current, setCurrent, images}) => {
    function update() {
        fetchDetails(itemID).then(d => {
            const images = getImages(d.images);
            triggerEvent('images:update', {images});
            // store.dispatch(actions.updateItem({data: {images, id:itemID}, field:'images'}));
        })
    }

    return (
        <div className="preview">
            <div className="preview-inner">
                {
                    images.map((im, i) => {
                            return <img className={current === i ? 'current' : ''}
                                        src={im.thumb}
                                        key={im.thumb}
                                        onClick={() => setCurrent(im.index)} alt=""/>
                        }
                    )
                }
            </div>
            <Button variant={'contained'} className={'h'} onClick={update}>Качество</Button>

        </div>

    )
}

function PreviewModule({children, ...props}) {
    const state = useLightboxState();
    return <>
        {children}
        <div className={'preview-header'}>
        </div>
        <Preview images={state.slides}
                 setCurrent={props.setCurrent}
                 current={state.currentIndex}>

        </Preview>
    </>;
}

const module = createModule("MyModule", PreviewModule);

function PreviewPlugin({addModule}) {
    addModule(module);
}

function prepareImages(images) {
    return images.map((im, i) => {
        let orig = Object.values(im)[1];
        return {
            src: orig,
            thumb: Object.values(im)[0],
            index: i,
        }
    });
}

const Images = () => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const [images, setImages] = useState([]);

    useAddEvent('images:open', e => {
        const {images, start, id} = e.detail;
        itemID = id;
        setImages(prepareImages(images));
        setOpen(true);
        setCurrent(start);
    })

    useAddEvent('images:update', ({detail}) => {
        setImages(prepareImages(detail.images));
    })

    function onClose() {
        setOpen(false);
    }
    function set() {
        let cont = document.querySelector('.yarl__carousel');
        if (!cont) return;
        let preview = document.querySelector('.preview');
        cont.addEventListener('click', e => {
            preview.style.zIndex = -1;
            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            for (const el of elements) {
                if (el.classList.contains('preview')) {
                    preview.style.zIndex = 1;
                    return;
                }
            }
        })
    }

    return (
        <div>
            <Lightbox
                index={current}
                on={{entered:set}}
                setCurrent={setCurrent}
                open={open}
                plugins={[Zoom, Counter, PreviewPlugin]}
                counter={{container: {style: {top: 0, bottom: "unset"}}}}
                animation={{fade: 100, swipe: 200}}
                carousel={{
                    padding: 0,
                    spacing: 0,
                    preload: 50,
                }}
                controller={{closeOnPullDown: true, closeOnPullUp: true}}
                close={onClose}
                slides={images}
            />
        </div>
    );
};

export default Images;