import { Form, FloatingLabel, Modal, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import '../styles/_customModal.scss';
import TreeLibrary from "../components/test/Tree";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import '../styles/_tree.scss';
import '../styles/_button.scss';
import { endsWith } from "lodash";

const Trees = ({ v_treeName, show, onHide, listData, v_modalPropsData }) => {
    const [v_handlingHtml, setVHandlingHtml] = useState(null);

    const [bizTreeData, setBizTreeData] = useState([]);
    const [corTreeData, setCorTreeData] = useState([]);

    const [inputValues, setInputValues] = useState({biz: {}, cor: {},});
    
    const [saleMsg, setSaleMsg] = useState(null);
    useEffect(() => {
        if (v_modalPropsData) {
            setSaleMsg(v_modalPropsData.sale_amt);
        }
        // console.log(inputValues);
    }, [v_modalPropsData, inputValues]);

    const switchData = (switchName) => {
        console.log(switchName);
    }
    useEffect(() => {
        if (listData) {
            setBizTreeData(listData.data.search_biz_section_code);
            setCorTreeData(listData.data.search_last_client_com_code);
        }
    }, [listData]);

    const treeRender = (data, type) => (
        data.map((item, index) => ({
            title: (
                <>
                <div className={`${index}`}>
                    <span>{item.small_classi_name}</span>
                    <input
                        type="number"
                        placeholder="비고"
                        onBlur={(e) => sum(e, type)}
                        onChange={(e) => handleInputChange(e, type, item.small_classi_code)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                </>),
            key: `${type}-${index}`,
    })));


    
    const [sumBiz, setSumBiz] = useState(0);
    const [sumCor, setSumCor] = useState(0);
    const sum = (e, type) => {
        // console.log('blur event', e.target, type);
        const parent = e.target.parentElement.parentElement.parentElement;
        console.log(parent, parent.classList.contains('rc-tree-node-selected'));
        console.log('input e: ', e);
        if (parent.classList.contains('rc-tree-node-selected')) {
            console.log("선택됨!!!");
            type === 'biz' ? 
            setSumBiz((prev) => prev + Number(e.target.value)) :
            setSumCor((prev) => prev + Number(e.target.value))
        } else {
            type === 'biz' ? 
            setSumBiz((prev) => prev - Number(e.target.value)) :
            setSumCor((prev) => prev - Number(e.target.value))
        }
    }
    const handleInputChange = (e, type, key) => {
        // console.log(e);
        e.stopPropagation();
        setInputValues((prev) => {
            const updatedInput = {
                ...prev,
            };
            updatedInput[type] = {
                ...prev[type],
                [key]: e.target.value,
            }
            return updatedInput;
        });
    };
    
    const [selectedBizKeys, setSelectedBizKeys] = useState([]);
    const [selectedCorKeys, setSelectedCorKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [lastEvent, setLastEvent] = useState(null); 
    const onSelect = (type) => (selectedKeys, info) => {
        type === 'biz' ?
        setSelectedBizKeys(selectedKeys) : 
        setSelectedCorKeys(selectedKeys);
    }
    const onCheck = (checkedKeys, info) => {
        console.log(info)
        console.log("체크된 키:", checkedKeys);
        setCheckedKeys(checkedKeys);
    };
    useEffect(()=> {
        if (show) {
        } else {
            setInputValues({biz: {}, cor: {}});
            setSelectedBizKeys([]);
            setSelectedCorKeys([]);
            setCheckedKeys([]);
            setSumBiz(0);
            setSumCor(0);
        }
    }, [show])
    useEffect(() => {
        const updateUI = () => { 
            if (bizTreeData && corTreeData) {
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
                                        {/* <div className="searchItem">
                                            <FloatingLabel label='검색' controlId="floatingInput">
                                                <Form.Control size='sm' type='text' placeholder="검색" />
                                            </FloatingLabel>
                                            <Button variant='info'>조회</Button>
                                        </div> */}
                                        <Row className="cntntArea">
                                            <Col className="cntnt">
                                                <h3 className="mb-4">{bizTreeData[0].great_classi_name}</h3>
                                                <h4>현재 사업 구분 금액: {sumBiz.toLocaleString('ko-KR')}</h4>
                                                <Tree multiple checkStrictly treeData={treeRender(bizTreeData, 'biz')} /* onCheck={onSelect}  */onSelect={(selectedKeys, info) => onSelect('biz')(selectedKeys, info)}/*  checkedKeys={checkedKeys} *//* onSelect={(checkedKeys, info) => onSelect((checkedKeys, info))} *//> 
                                            </Col>
                                            <Col className="cntnt">
                                                <h3 className="mb-4">{corTreeData[0].great_classi_name}</h3>
                                                <h4>현재 사업 구분 금액: {sumCor.toLocaleString('ko-KR')}</h4>
                                                <Tree multiple checkStrictly treeData={treeRender(corTreeData, 'cor')} onSelect={(e) => onSelect(e, 'cor')}/> 
                                            </Col>
                                        </Row>
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
    }, [listData, bizTreeData, corTreeData, show, onHide, /* selectedBizKeys */, checkedKeys, saleMsg, sumBiz, sumCor]);
  
    return (
        <>
        {v_handlingHtml}
        </>
    )
}

export default Trees;