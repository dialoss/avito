import Modal from "react-bootstrap/Modal";
import {Button} from "@mui/material";
import React from "react";

export function MyModal({children, title, ...props}) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}