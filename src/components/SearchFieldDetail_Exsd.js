import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SearchFieldDetail = ({ show, onHide }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>사업 (기회) 등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>모달 내용입니다.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    닫기
                </Button>
                <Button variant="primary">등록</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SearchFieldDetail;
