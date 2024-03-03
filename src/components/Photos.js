import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import {createModule, useController, useLightboxProps, useLightboxState} from "yet-another-react-lightbox";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


const Preview = ({current, setCurrent, images}) => {
    return (
        <div className="preview">
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
    )
}

function PreviewModule({children, ...props}) {
    const state = useLightboxState();
    return <>{children}<div className={'preview-header'}></div><Preview images={state.slides}
                                setCurrent={props.setCurrent}
                                current={state.currentIndex}></Preview></>;
}

const module = createModule("MyModule", PreviewModule);

function PreviewPlugin({addModule}) {
    addModule(module);
}

const Images = () => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const [images, setImages] = useState([]);

    window.openViewer = (images, start) => {
        const viewerImages = images.map((im, i) => {
            let orig = Object.values(im)[1];
            let [w, h] = Object.keys(im)[1].split('x');
            return {
                src: orig,
                thumb: Object.values(im)[0],
                index: i,
            }
        });
        setImages(viewerImages);
        setOpen(true);
        setCurrent(start);
    }

    function onClose() {
        setOpen(false);
    }

    return (
        <div>
            <Lightbox
                index={current}
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