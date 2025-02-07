import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import '../styles/_customModal.scss';
import TreesTest from "../components/test/Tree";
import { Form, FloatingLabel } from "react-bootstrap";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import '../styles/_tree.scss';
import '../styles/_button.scss';

const Trees = ({ v_treeName, show, onHide, data }) => {
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const [treeData, setTreeData] = useState([]);

    let bizCode, corCode, priCode;
    const switchData = (switchName) => {
        console.log(switchName);
    }
    useEffect(() => {
        if (data) {
            bizCode = data.data.search_biz_section_code;
            corCode = data.data.search_last_client_com_code;
            priCode = data.data.search_principal_product_code;
            console.log(bizCode, corCode, priCode);
            const bizData = bizCode.map((e, index) => ({
                title: e.small_classi_name,
                key: `0-${index}`, // 키를 유니크하게 변경
                children: [
                    {
                        title: 'Level 2 - Node 1',
                        key: `0-${index}-0`,
                        children: [
                            { title: 'Level 3 - Node 1 (isLeaf)', key: `0-${index}-0-0`, isLeaf: true },
                            { title: 'Level 3 - Node 2 (disabled)', key: `0-${index}-0-1`, disabled: true },
                        ],
                    }
                ],
            }));
            const newTreeData = bizCode.map((e, index) => ({
                title: e.small_classi_name,
                key: `0-${index}`, // 키를 유니크하게 변경
                children: [
                    {
                        title: 'Level 2 - Node 1',
                        key: `0-${index}-0`,
                        children: [
                            { title: 'Level 3 - Node 1 (isLeaf)', key: `0-${index}-0-0`, isLeaf: true },
                            { title: 'Level 3 - Node 2 (disabled)', key: `0-${index}-0-1`, disabled: true },
                        ],
                    }
                ],
            }));
        
            setTreeData(newTreeData); // 한 번만 상태 업데이트
        }
    }, [data]);
    
    useEffect(() => {
        const updateUI = () => { 
            if (data) {
                if (v_treeName === 'product') {
                    setVHandlingHtml(
                        <Modal size='xl' show={show} onHide={onHide} id='commonTreeArea'>
                            <Modal.Header closeButton>
                                <Modal.Title className='fs-3'>
                                    매출 상세 관리
                                </Modal.Title>
                            </Modal.Header> 
                            <Modal.Body>
                                <div className='modalcntnt'>
                                    <div className="inputField">
                                        <h3>{data.data.search_biz_section_code[0].great_classi_name}</h3>
                                        <div className="btnArea treeBtnArea">
                                            <Button variant="secondary" onClick={(e) => switchData(data.data.search_biz_section_code[0].great_classi_name)}>
                                                {data.data.search_biz_section_code[0].great_classi_name}
                                            </Button>
                                            <Button variant="secondary" onClick={(e) => switchData(data.data.search_last_client_com_code[0].great_classi_name)}>
                                                {data.data.search_last_client_com_code[0].great_classi_name}
                                            </Button>
                                        </div>
                                        <div className="searchItem">
                                            <FloatingLabel label='검색' controlId="floatingInput">
                                                <Form.Control size='sm' type='text' placeholder="검색" />
                                            </FloatingLabel>
                                            <Button variant='info'>조회</Button>
                                        </div>
                                        <Tree treeData={treeData} />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="btnArea justify-content-center">
                                <Button variant='primary'/*  onClick={(e) => f_handlingData('post', 'update-biz-opp-activity/', updateInput, e, '수정')} */>확인</Button>
                                <Button variant="secondary" onClick={onHide}>
                                닫기
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )
    
                } 
            } else {
                <div>Loading...</div>;
            }
        };
        updateUI();
    }, [data, show, onHide]);
  
    return (
        <>
            {v_handlingHtml}
        </>
    )
}

export default Trees;