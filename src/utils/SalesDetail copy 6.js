import { Form, FloatingLabel, Modal, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import '../styles/_customModal.scss';
import TreeLibrary from "../components/test/Tree";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import '../styles/_tree.scss';
import '../styles/_button.scss';
import { endsWith, lowerCase, sum, toLower } from "lodash";

const Trees = ({ v_treeName, show, onHide, listData, v_modalPropsData, setSalesDetailData }) => {
    // =================== 렌더 시 세팅 ===================  
    const [saleMsg, setSaleMsg] = useState(null);
    useEffect(() => {
        if (v_modalPropsData) { 
            setSaleMsg(Number(v_modalPropsData.sale_amt)); 
        }
    }, [v_modalPropsData]);

    const [bizTreeData, setBizTreeData] = useState([]);
    const [corTreeData, setCorTreeData] = useState([]);
    const [propsBizIndex, setPropsBizIndex] = useState(null);
    const [propsCorIndex, setPropsCorIndex] = useState(null);
    useEffect(() => {
        if (listData) {
            const bizData = listData.data.search_biz_section_code;
            const corData = listData.data.search_last_client_com_code;
            setBizTreeData(bizData);
            setCorTreeData(corData);
            console.log(corData);
            if (v_modalPropsData) {
                console.log(v_modalPropsData);
                bizData.some((e, index) => {
                    if (e.small_classi_code === v_modalPropsData.biz_section2_code) {
                        // console.log(`${lowerCase(v_modalPropsData.biz_section1_code)}-${index}`);
                        setPropsBizIndex(index);
                        return true;
                    }
                    return false;
                });
                corData.some((e, index) => {
                    // console.log("cor data", e.small_classi_code, v_modalPropsData.sale_com2_code, index);
                    if (e.small_classi_code === v_modalPropsData.sale_com2_code) {
                        // console.log(`${lowerCase(v_modalPropsData.sale_com1_code)}-${index}`);
                        setPropsCorIndex(index);
                        return true;
                    }
                    return false;
                });
            } else {
                return;
            }
        }
    }, [listData]);


    const treeRender = (data, type) => (
        data.map((item, index) => ({
            title: (
                <div className={`${index}`} data-key={`${type}-${index}`}>
                    <span>{item.small_classi_name}</span>
                    <input
                        type="number"
                        placeholder="세부 금액"
                        defaultValue={0}
                        value={inputValues[type]?.[item.small_classi_code] ?? ''}
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
    // onSelect로 호출한 node가 selected true인 경우 inputValues 객체에 키와 값을 추가 / false일 경우 키와 값을 삭제
    const onSelect = (type) => (selectedKeys, info) => {
        const key = info.node.small_classi_code;
    
        type === "biz" ? setSelectedBizKeys(selectedKeys) : setSelectedCorKeys(selectedKeys);
        setIsSelected(info.selected);
    
        setInputValues((prev) => {
            return {
                ...prev,  // ✅ 기존 값 유지
                [type]: {
                    ...prev[type],
                    ...(info.selected ? { [key]: 0 } : {}),
                }
            };
        });
    };
    
    /* const onSelect = (type) => (selectedKeys, info) => {
        const key = info.node.small_classi_code; // ✅ small_classi_code 사용
    
        type === "biz" ? setSelectedBizKeys(selectedKeys) : setSelectedCorKeys(selectedKeys);
        setIsSelected(info.selected);
    
        setInputValues((prev) => {
            const updatedInput = { ...prev };

            if (info.selected) {
                // ✅ 선택된 경우 inputValues에 추가 (기본값 0)
                if (!updatedInput[type]?.[key]) {
                    updatedInput[type] = {
                        ...updatedInput[type],
                        [key]: 0,
                    };
                }
            } else {
                // ✅ 선택 해제된 경우, 해당 key를 삭제
                if (updatedInput[type]?.[key] !== undefined) {
                    delete updatedInput[type][key];
                }
            }
    
            return updatedInput;
        });
    }; */

    // 선택 해제된 key는 UI에서 0으로 유지
    useEffect(() => {
        setInputValues((prev) => {
            return {
                ...prev,  // ✅ 기존 값 유지
                biz: { ...prev.biz },
                cor: { ...prev.cor }
            };
        });
    }, [isSelected]);
    
/*     useEffect(() => {
        setInputValues((prev) => {
            const updatedInput = { ...prev };
            Object.keys(isSelected).forEach((key) => {
                if (!isSelected[key]) {
                    if (updatedInput.biz[key] !== undefined) updatedInput.biz[key] = 0;
                    if (updatedInput.cor[key] !== undefined) updatedInput.cor[key] = 0;
                }
            });

            return updatedInput;
        });
    }, [isSelected]); // 변경된 key들을 감지하여 실행 */
    // =================== onSelect 시 핸들링 끝 ===================  

    // =================== input value 받아오기 ===================  
    // input key: 해당 객체의 code 값 / value: e.target.value
    const [inputValues, setInputValues] = useState({biz: {}, cor: {}, a_product_name: ''});

    // 입력 시마다 inputValues 객체의 키와 값 업데이트
    const handleInputChange = (e, type, key) => {
        const value = e.target.value;
        setInputValues((prev) => {
            return {
                ...prev,
                ...(type === 'a_product_name' 
                    ? { a_product_name: value }  // ✅ a_product_name을 문자열로 업데이트
                    : { [type]: { ...prev[type], [key]: Number(value) } }
                )
            }
        });
    };
    
    // --------------------- input value 합산 ---------------------  
    const [sumBiz, setSumBiz] = useState(0);
    const [sumCor, setSumCor] = useState(0);
    useEffect(() => {
        const bizValueArr = Object.values(inputValues.biz);
        const corValueArr = Object.values(inputValues.cor);
        const bizTotal = bizValueArr.reduce((acc, cur) => acc + cur, 0); 
        const corTotal = corValueArr.reduce((acc, cur) => acc + cur, 0); 
        setSumBiz(bizTotal);
        setSumCor(corTotal);
        console.log('inputValues: ', inputValues, '\nbizTotal: ', bizTotal, '\ncorTotal: ', corTotal);
    }, [inputValues]);
    // --------------------- input value 합산 끝 ---------------------  
    // =================== input value 받아오기 끝 ===================
      
    // =================== 선택 버튼 클릭 시 매출 금액과 총 합산 금액 비교 ===================

    const saveData = (e) => {
        console.log('saveData에서의 inputValues', inputValues);
        if (sumBiz !== saleMsg) {
            alert ('사업 구분 필드의 총 금액은 매출 금액과 일치해야 합니다.');
            return;
        }
        if (sumCor !== saleMsg) {
            alert ('제조사명 필드의 총 금액은 매출 금액과 일치해야 합니다.');
            return;
        }
        if (!inputValues.a_product_name) {
            alert ('제품명을 입력하세요.');
            return;
        }
        
        setSalesDetailData((prev) => ({
            ...prev,
            biz: { ...inputValues.biz },
            cor: { ...inputValues.cor },
            a_product_name: inputValues.a_product_name, // ✅ 값 유지
        }));
    
        setTimeout(() => {
            onHide(true);
        }, 100);
    }
    
    // 초기화
    useEffect(()=> {
        if (!show) {
            setInputValues({biz: {}, cor: {}, a_product_name: ''});
            setSelectedBizKeys([]);
            setSelectedCorKeys([]);
            setSumBiz(0);
            setSumCor(0);
            setIsSelected(false);
        }
    }, [show])

    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    useEffect(() => {
        const updateUI = () => { 
            if (bizTreeData.length > 0 && corTreeData.length > 0) {
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
                                        <div className="mb-4">
                                            <h3>매출 금액: &#65510;{saleMsg.toLocaleString('ko-KR')}</h3>
                                            <h4 style={{'textAlign':'center'}}>사업 구분 필드의 총 금액 / 제조사명 필드의 총 금액은 각각 매출 금액과 반드시 일치해야 합니다.</h4>
                                        </div>
                                        <Row className="cntntArea">
                                            <Col className="cntnt textArea">
                                                <h3 className="mb-4">사업 구분</h3>
                                                <h4>매출 금액: &#65510;{saleMsg.toLocaleString('ko-KR')}</h4>
                                                <h4>현재 사업 구분 금액: &#65510;{sumBiz.toLocaleString('ko-KR')}</h4>
                                                <Tree ref={treeRef} multiple checkStrictly treeData={treeRender(bizTreeData, 'biz')} onSelect={(selectedKeys, info) => onSelect('biz')(selectedKeys, info)} defaultSelectedKeys={`${lowerCase(v_modalPropsData.biz_section1_code)}-${propsBizIndex}`}
                                                /> 
                                            </Col>
                                            <Col className="cntnt">
                                                <h3 className="mb-4">제조사명</h3>
                                                <h4>매출 금액: &#65510;{saleMsg.toLocaleString('ko-KR')}</h4>
                                                <h4>현재 제조사명 금액: &#65510;{sumCor.toLocaleString('ko-KR')}</h4>
                                                <Tree ref={treeRef} multiple checkStrictly treeData={treeRender(corTreeData, 'cor')} onSelect={(selectedKeys, info) => onSelect('cor')(selectedKeys, info)} defaultSelectedKeys={`${lowerCase(v_modalPropsData.sale_com1_code)}-${propsCorIndex}`}
                                                /> 
                                            </Col>
                                        </Row>
                                        <Row className="cntntArea">
                                            <Col className="cntnt product">
                                                <FloatingLabel label='제품명 (제품 비고)'>
                                                    <Form.Control size='sm' type='text' className=''
                                                    name='a_a_product_name' 
                                                    placeholder='제품명 (제품 비고)'
                                                    onChange={(e) => handleInputChange(e, 'a_product_name', null)}
                                                    defaultValue={v_modalPropsData?.a_product_name || ''}
                                                    /* onChange={f_handlingInput} 
                                                    // value={input.biz_opp_id}
                                                    defaultValue={a_v_modalPropsData?.a_biz_opp_id || ''} 
                                                    disabled={
                                                        (auth.userAuthCode === '0002') ? 
                                                        (false) : (true)
                                                    } */
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="btnArea justify-content-center">
                                <Button variant='primary' onClick={(e) => saveData(e)}>선택</Button>
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