import { Form, FloatingLabel, Modal, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import '../styles/_customModal.scss';
import TreeLibrary from "../components/test/Tree";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import '../styles/_tree.scss';
import '../styles/_button.scss';

const Trees = ({ v_treeName, show, onHide, listData, v_modalPropsData }) => {
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    const [bizTreeData, setBizTreeData] = useState([]);
    const [corTreeData, setCorTreeData] = useState([]);


    const [inputValues, setInputValues] = useState({
        biz: {},
        cor: {},
    });
    const [saleMsg, setSaleMsg] = useState(null);
    useEffect(() => {
        if (v_modalPropsData) {
            setSaleMsg(v_modalPropsData.sale_amt);
        }
        console.log(inputValues);
    }, [v_modalPropsData, inputValues]);

    const switchData = (switchName) => {
        console.log(switchName);
    }
    const handleInputChange = (e, type, key) => {
        e.stopPropagation();
        
        setInputValues((prev) => {
            const updatedInput = {
                ...prev,
            };
            type === 'biz' ? 
            updatedInput.biz = {
                ...prev.biz,
                [key]: e.target.value,
            } :
            updatedInput.cor = {
                ...prev.cor,
                [key]: e.target.value,
            }
            return updatedInput;
        });
    };
    
    
   /*  useEffect(() => {
        if (listData) {
            const bizCode = listData.data.search_biz_section_code
            const corCode = listData.data.search_last_client_com_code
        }
    }, [listData]); */
    const treeRender = (data, type) => (
        data.map((item, index) => ({
            title: (
                <>
                <div className={`${index}`}>
                <span>{item.small_classi_name}</span>
                    <input
                        type="text"
                        placeholder="비고"
                        onChange={(e) => handleInputChange(e, type, item.small_classi_code)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                </>),
            key: `${type}-${index}`,
    })));

    const [selectedKeys, setSelectedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const onSelect = (selectedKeys, info) => {
        // console.log('selected key', selectedKeys);
        console.log('info', info);
        console.log('selected key info', info.node.title);
        setSelectedKeys(selectedKeys);
    }
    const onCheck = (checkedKeys, info) => {
        console.log(info)
        console.log("체크된 키:", checkedKeys);
        setCheckedKeys(checkedKeys);
    };
    
    useEffect(()=> {
        if(show) {
        } else {
            setInputValues({biz: {}, cor: {}});
            setSelectedKeys([]);
            setCheckedKeys([]);
        }
    }, [show])
    useEffect(() => {
        const updateUI = () => { 
            if (listData) {
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
                                        <h3>{listData.data.search_biz_section_code[0].great_classi_name}</h3>
                                        <div className="btnArea treeBtnArea">
                                            <Button variant="secondary" onClick={(e) => switchData(listData.data.search_biz_section_code[0].great_classi_name)}>
                                                {listData.data.search_biz_section_code[0].great_classi_name}
                                            </Button>
                                            <Button variant="secondary" onClick={(e) => switchData(listData.data.search_last_client_com_code[0].great_classi_name)}>
                                                {listData.data.search_last_client_com_code[0].great_classi_name}
                                            </Button>
                                        </div>
                                        {/* <div className="searchItem">
                                            <FloatingLabel label='검색' controlId="floatingInput">
                                                <Form.Control size='sm' type='text' placeholder="검색" />
                                            </FloatingLabel>
                                            <Button variant='info'>조회</Button>
                                        </div> */}
                                        <Row className="cntntArea">
                                            <Col className="cntnt">
                                                <Tree multiple checkStrictly treeData={treeRender(listData.data.search_biz_section_code, 'biz')} /* onCheck={onSelect}  */onSelect={onSelect}/*  checkedKeys={checkedKeys} *//* onSelect={(checkedKeys, info) => onSelect((checkedKeys, info))} *//> 
                                            </Col>
                                            <Col className="cntnt">
                                                <Tree multiple checkStrictly treeData={treeRender(listData.data.search_last_client_com_code, 'cor')}/> 
                                            </Col>
                                        </Row>
                                        <p>selectedKeys: {JSON.stringify(selectedKeys)}</p>
                                        <h3>매출 금액: {saleMsg.toLocaleString('ko-KR')}</h3>
                                        <h4 style={{'textAlign':'center'}}>사업 구분의 총 금액 / 제조사의 총 금액은 각각 매출 금액과 동일해야 합니다.</h4>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="btnArea justify-content-center">
                                <Button variant='primary'/*  onClick={(e) => f_handlingData('post', 'update-biz-opp-activity/', updateInput, e, '수정')} */>선택</Button>
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
    }, [listData, bizTreeData, corTreeData, show, onHide, selectedKeys, checkedKeys, saleMsg]);
  
    return (
        <>
        {v_handlingHtml}
        </>
    )
}

export default Trees;