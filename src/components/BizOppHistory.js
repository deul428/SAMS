import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from 
"react-bootstrap";

const BizOppHistory = ({ show, onHide }) => {
    console.log("Modal Props - show:", show, ", onHide:", onHide);
  
    const [v_handlingHtml, setVHandlingHtml] = useState(null);

    useEffect(() => {
        setVHandlingHtml(
            <Modal size='xl' show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='fs-3'>사업 (기회) 이력 조회
                    </Modal.Title>
                </Modal.Header>
            </Modal>
        );
    }, [show, onHide]);
  
    return (
        <div id='bizOppHistory' className="wrap">
            {v_handlingHtml}
        </div>
    )
}

export default BizOppHistory;