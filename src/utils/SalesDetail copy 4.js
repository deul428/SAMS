import { Form, FloatingLabel, Modal, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import '../styles/_customModal.scss';
import TreeLibrary from "../components/test/Tree";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import '../styles/_tree.scss';
import '../styles/_button.scss';
import { endsWith } from "lodash";

const Trees = ({ v_treeName, show, onHide, listData, v_modalPropsData }) => {
    // =================== 렌더 시 세팅 ===================  
    const [saleMsg, setSaleMsg] = useState(null);
    useEffect(() => {
        if (v_modalPropsData) { setSaleMsg(v_modalPropsData.sale_amt); }
    }, [v_modalPropsData]);

    const [bizTreeData, setBizTreeData] = useState([]);
    const [corTreeData, setCorTreeData] = useState([]);
    useEffect(() => {
        if (listData) {
            setBizTreeData(listData.data.search_biz_section_code);
            setCorTreeData(listData.data.search_last_client_com_code);
        }
    }, [listData]);
    const treeRender = (data, type) => (
        data.map((item, index) => ({
            title: (
                <div className={`${index}`} data-key={`${type}-${index}`}>
                    <span>{item.small_classi_name}</span>
                    <input
                        type="number"
                        placeholder="비고"
                        value={inputValues[type][item.small_classi_code] ?? 0} // ✅ 삭제된 key는 0으로 유지
                        onBlur={(e) => sum(e, type)}
                        onChange={(e) => handleInputChange(e, type, item.small_classi_code)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ),
            key: `${type}-${index}`, // ✅ rc-tree에서 사용하는 key
            small_classi_code: item.small_classi_code, // ✅ onSelect에서 사용할 key 추가
        }))
    );
    
    
    // =================== 렌더 시 세팅 끝 ===================  

    
    // =================== onSelect 시 핸들링 ===================  
    // onSelect 시 해당 key 저장, 현재로서는 필요없어 보이는데 나중에 사용할까 봐 남겨 둠.
    const [selectedBizKeys, setSelectedBizKeys] = useState([]);
    const [selectedCorKeys, setSelectedCorKeys] = useState([]);

    // selected flag
    const [isSelected, setIsSelected] = useState([]);

    const treeRef = useRef(null);
    
    /* const onSelect = (type) => (selectedKeys, info) => {
        console.log("🚀 선택된 키:", selectedKeys);
        console.log("🚀 선택된 노드 정보:", info);
    
        const key = info.node.small_classi_code; // ✅ small_classi_code 사용
        type === "biz" ? setSelectedBizKeys(selectedKeys) : setSelectedCorKeys(selectedKeys);
        setIsSelected(info.selected);
    
        // ✅ 선택 해제된 경우, 해당 key 값만 0으로 변경
        if (!info.selected) {
            setInputValues((prev) => {
                const updatedInput = { ...prev };
                if (updatedInput[type][key] !== undefined) {
                    delete updatedInput[type][key];
                }
                return updatedInput;
            });
        }
    }; */
    const onSelect = (type) => (selectedKeys, info) => {
        console.log("🚀 선택된 키:", selectedKeys);
        console.log("🚀 선택된 노드 정보:", info);
    
        const key = info.node.small_classi_code; // ✅ small_classi_code 사용
    
        if (type === "biz") {
            setSelectedBizKeys(selectedKeys);
        } else {
            setSelectedCorKeys(selectedKeys);
        }
    
        setIsSelected(info.selected);
    
        // ✅ 선택 해제된 경우, 해당 key를 완전히 삭제
        if (!info.selected) {
            setInputValues((prev) => {
                const updatedInput = { ...prev };
                if (updatedInput[type]?.[key] !== undefined) {
                    delete updatedInput[type][key]; // ✅ 해당 key 삭제
                }
                return updatedInput;
            });
        }
    };
    
    

    // =================== onSelect 시 핸들링 끝 ===================  

    // =================== input value 받아오기 ===================  
    // input key: 해당 객체의 code 값 / value: e.target.value
    const [inputValues, setInputValues] = useState({biz: {}, cor: {},});
    const [sumBiz, setSumBiz] = useState(0);
    const [sumCor, setSumCor] = useState(0);

    useEffect(() => {
        console.log("현재 inputValues:", inputValues);
        const valueArr = Object.values(inputValues.biz).map(Number); // 🚀 숫자로 변환
        const totalSum = valueArr.reduce((acc, cur) => acc + cur, 0); 
        setSumBiz(totalSum);

        console.log("합계 업데이트:", totalSum);
    }, [inputValues]);

    useEffect(() => {
        console.log("현재 isSelected 상태:", isSelected);
    
        setInputValues((prev) => {
            const updatedInput = { ...prev };
    
            // ✅ 선택 해제된 key는 UI에서 0으로 유지
            Object.keys(isSelected).forEach((key) => {
                if (!isSelected[key]) {
                    if (updatedInput.biz[key] !== undefined) updatedInput.biz[key] = 0;
                    if (updatedInput.cor[key] !== undefined) updatedInput.cor[key] = 0;
                }
            });
    
            return updatedInput;
        });
    }, [isSelected]); // ✅ 변경된 key들을 감지하여 실행

    const handleInputChange = (e, type, key) => {
        // console.log(e);
        console.log(key);
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
    

    
    // --------------------- input value 합산 ---------------------  
    const sum = (e, type) => {
        /* if (isSelected) {
            console.log("선택됨!!!");
            type === 'biz' ? 
            setSumBiz((prev) => prev + Number(e.target.value)) :
            setSumCor((prev) => prev + Number(e.target.value));
        } else {
            type === 'biz' ? 
            setSumBiz((prev) => prev - Number(e.target.value)) :
            setSumCor((prev) => prev - Number(e.target.value));
        } */
    };
    // --------------------- input value 합산 끝 ---------------------  
    // =================== input value 받아오기 끝 ===================  
    
    // 초기화
    useEffect(()=> {
        if (show) {
        } else {
            setInputValues({biz: {}, cor: {}});
            setSelectedBizKeys([]);
            setSelectedCorKeys([]);
            setSumBiz(0);
            setSumCor(0);
        }
    }, [show])

    const [v_handlingHtml, setVHandlingHtml] = useState(null);
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
                            {/* <input
                                type="number"
                                placeholder="비고"
                                defaultValue={isDisabled ? 0 : ''}
                                onClick={(e) => e.stopPropagation()}
                                // style={isDisabled ? {"display":"none"} : {"display":"inline-block"}}
                                disabled={isDisabled ? false : true }
                            /> */}
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
                                                <Tree ref={treeRef} multiple checkStrictly treeData={treeRender(bizTreeData, 'biz')} onSelect={(selectedKeys, info) => onSelect('biz')(selectedKeys, info)}
                                                /> 
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
    }, [listData, bizTreeData, corTreeData, show, onHide, /* selectedBizKeys */, saleMsg, sumBiz, sumCor]);
  
    return (
        <>
        {v_handlingHtml}
        </>
    )
}

export default Trees;