import { Form, FloatingLabel, Modal, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import '../styles/_customModal.scss';
import TreeLibrary from "../components/test/Tree";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import '../styles/_tree.scss';
import '../styles/_button.scss';
import { endsWith, lowerCase, sum, toLower } from "lodash";

const SalesDetail = ({ v_treeName, show, onHide, listData, v_modalPropsData, setSalesDetailData }) => {
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
                <div className="titleArea">
                    {/* ✅ radio 버튼 클릭 시 `handleInputChange` 실행 (isRadio=true) */}
                    <input 
                        type="radio"
                        name={`radio-${type}`}
                        value={item.small_classi_code}
                        // defaultChecked={true}
                        // defaultValue={true}
                        // checked={inputValues[type]?.[item.small_classi_code]?.[1] ?? false}
                        onChange={() => handleInputChange(null, type, item.small_classi_code, true)}
                        onClick={(e) => e.stopPropagation()} // ✅ onSelect 방지
                    />
                    <div className={`${index} titleItem`} data-key={`${type}-${index}`}>
                        <span>{item.small_classi_name}</span>
                        <input
                            type="number"
                            placeholder="세부 금액"
                            defaultValue={0}
                            value={inputValues[type]?.[item.small_classi_code]?.[0] ?? 0}
                            onChange={(e) => handleInputChange(e, type, item.small_classi_code)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            ),
            key: `${type}-${index}`,
            small_classi_code: item.small_classi_code
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
        if (type !== 'biz' && type !== 'cor') return;
    
        const key = info.node.small_classi_code;
        type === "biz" ? setSelectedBizKeys(selectedKeys) : setSelectedCorKeys(selectedKeys);
        setIsSelected(info.selected);
    
        setInputValues((prev) => {
            const updatedType = prev[type] ? { ...prev[type] } : {};
    
            if (info.selected) {
                // ✅ 기존 `boolean` 값 유지
                updatedType[key] = Array.isArray(updatedType[key])
                    ? [updatedType[key][0], updatedType[key][1] ?? false]  // 기존 boolean 값 유지
                    : [0, false];  // 기본값 설정
            } else {
                delete updatedType[key];
            }
    
            return {
                ...prev,
                [type]: updatedType
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
                cor: { ...prev.cor },
                a_product_name: prev.a_product_name
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


    const sampleData = [
        {
            "biz_opp_id": "20250044",
            "detail_no": 1,
            "great_classi_code": "COR",
            "small_classi_code": "0001",
            "sale_amt": 500,
            "delegate_tf": true,
            "create_user": "leecj",
            "create_date": "2025-02-13 16:42:23.597",
            "update_user": null,
            "update_date": null,
            "delete_user": null,
            "delete_date": null
        },
        {
            "biz_opp_id": "20250045",
            "detail_no": 2,
            "great_classi_code": "BIZ",
            "small_classi_code": "0002",
            "sale_amt": 1500,
            "delegate_tf": false,
            "create_user": "kimhs",
            "create_date": "2025-02-14 09:15:10.123",
            "update_user": "admin",
            "update_date": "2025-02-14 12:30:45.456",
            "delete_user": null,
            "delete_date": null
        },
        {
            "biz_opp_id": "20250046",
            "detail_no": 3,
            "great_classi_code": "COR",
            "small_classi_code": "0003",
            "sale_amt": 2000,
            "delegate_tf": true,
            "create_user": "yjpark",
            "create_date": "2025-02-15 14:20:55.789",
            "update_user": null,
            "update_date": null,
            "delete_user": "admin",
            "delete_date": "2025-02-16 08:00:00.000"
        },
        {
            "biz_opp_id": "20250047",
            "detail_no": 4,
            "great_classi_code": "BIZ",
            "small_classi_code": "0004",
            "sale_amt": 750,
            "delegate_tf": false,
            "create_user": "jhlee",
            "create_date": "2025-02-16 18:45:30.987",
            "update_user": "manager",
            "update_date": "2025-02-17 10:15:20.321",
            "delete_user": null,
            "delete_date": null
        }
    ]
    const transformData = (data) => {
        console.log("transformData function: ", data);
        const result = {};
    
        if (data.biz || data.cor) { 
            Object.entries(data).forEach(([key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) { 
                    // biz, cor 내부 객체 순회
                    Object.entries(value).forEach(([small_classi_code, arr]) => {
                        const [sale_amt, delegate_tf] = arr;
    
                        const lower = key.toLowerCase(); // great_classi_code 대체
                        if (!result[lower]) {
                            result[lower] = {}; // ✅ 키가 없으면 초기화
                        }
    
                        result[lower][small_classi_code] = [sale_amt, delegate_tf]; // ✅ 값 추가
                    });
                }
            });
        }
    
        return result;
    };
    
   /*  const transformData = (data) => {
        console.log("transformData function: ", data);
        const result = {};
        
        if (data.biz || data.cor) {
            Object.entries(data).forEach((item) => {
                const { great_classi_code, small_classi_code, delegate_tf, sale_amt } = item;
        
                const lower = lowerCase(great_classi_code);
                if (!result[lower]) {
                    result[lower] = {}; // ✅ 키가 없으면 초기화
                }
        
                result[lower][small_classi_code] = [sale_amt, delegate_tf]; // ✅ 값 추가
            });
        }
        
        return result;
    }; */
    
    // const transformedData = transformData(inputValues);
    const compareAndUpdateModes = (initialData, updatedData) => {
        console.log(initialData, updatedData);
        let result = JSON.parse(JSON.stringify(updatedData));
    
        // 초기 데이터 기준으로 삭제 및 수정 탐색
        Object.keys(initialData).forEach(greatClassiCode => {
            if (!updatedData[greatClassiCode]) {
                return; // updatedData에 해당 대분류(greatClassiCode)가 없으면 스킵
            }
    
            Object.keys(initialData[greatClassiCode]).forEach(smallClassiCode => {
                if (updatedData[greatClassiCode]?.[smallClassiCode]) {
                    // 값 비교 후 변경(업데이트) 처리
                    if (JSON.stringify(initialData[greatClassiCode][smallClassiCode]) !== JSON.stringify(updatedData[greatClassiCode][smallClassiCode])) {
                        if (!Array.isArray(result[greatClassiCode][smallClassiCode])) {
                            result[greatClassiCode][smallClassiCode] = [...updatedData[greatClassiCode][smallClassiCode]];
                        }
                        result[greatClassiCode][smallClassiCode].push('U');
                    }
                } else {
                    // 삭제 처리
                    result[greatClassiCode][smallClassiCode] = [...initialData[greatClassiCode][smallClassiCode], 'D'];
                }
            });
        });
    
        // 업데이트된 데이터 기준으로 추가(Insert) 확인
        Object.keys(updatedData).forEach(greatClassiCode => {
            if (!initialData[greatClassiCode]) {
                return; // initialData에 해당 대분류(greatClassiCode)가 없으면 스킵
            }
    
            Object.keys(updatedData[greatClassiCode]).forEach(smallClassiCode => {
                if (!initialData[greatClassiCode]?.[smallClassiCode]) {
                    // 새롭게 추가된 데이터 처리
                    if (!Array.isArray(result[greatClassiCode][smallClassiCode])) {
                        result[greatClassiCode][smallClassiCode] = [...updatedData[greatClassiCode][smallClassiCode]];
                    }
                    result[greatClassiCode][smallClassiCode].push('I');
                }
            });
        });
    
        console.log("compareAndUpdateModes result: ", result);
        return result;
    };
    

/*     const compareAndUpdateModes = (initialData, updatedData) => {
        let result = JSON.parse(JSON.stringify(updatedData));
    
        Object.keys(initialData).forEach(greatClassiCode => {
            if (!updatedData.hasOwnProperty(greatClassiCode)) return;
    
            Object.keys(initialData[greatClassiCode]).forEach(smallClassiCode => {
                if (updatedData[greatClassiCode]?.hasOwnProperty(smallClassiCode)) {
                    if (JSON.stringify(initialData[greatClassiCode][smallClassiCode]) !== JSON.stringify(updatedData[greatClassiCode][smallClassiCode])) {
                        result[greatClassiCode][smallClassiCode].push('U');
                    }
                } else {
                    result[greatClassiCode][smallClassiCode] = [...initialData[greatClassiCode][smallClassiCode], 'D'];
                }
            });
    
            Object.keys(updatedData[greatClassiCode]).forEach(smallClassiCode => {
                if (!initialData[greatClassiCode]?.hasOwnProperty(smallClassiCode)) {
                    result[greatClassiCode][smallClassiCode].push('I');
                }
            });
        });
    
        console.log("compareAndUpdateModes result: ", result);
        return result;
    }; */
    
    
    const handleInputChange = (e, type, key, isRadio = false) => {
        setInputValues((prev) => {
            // ✅ `a_product_name`일 경우 단순 값 저장
            if (type === "a_product_name") {
                return {
                    ...prev,
                    a_product_name: e.target.value
                };
            }
    
            // ✅ `biz`, `cor`일 경우 `[num, boolean]` 형태 유지
            const updatedType = { ...prev[type] };
    
            if (isRadio) {
                // 모든 기존 항목을 false로 변경 (라디오 버튼 단일 선택 유지)
                Object.keys(updatedType).forEach((existingKey) => {
                    updatedType[existingKey] = Array.isArray(updatedType[existingKey])
                        ? [updatedType[existingKey][0], false]
                        : [0, false];
                });
    
                // 선택된 항목만 true로 설정
                updatedType[key] = Array.isArray(updatedType[key])
                    ? [updatedType[key][0], true]
                    : [0, true];
            } else {
                // 숫자 입력 시, 기존 boolean 값 유지
                updatedType[key] = Array.isArray(updatedType[key])
                    ? [Number(e.target.value), updatedType[key][1] ?? false]
                    : [Number(e.target.value), false];
            }
    
            return {
                ...prev,
                [type]: updatedType
            };
        });
    };
    

    
    const inputValuesRef = useRef(inputValues);
    // --------------------- input value 합산 ---------------------  
    const [sumBiz, setSumBiz] = useState(0);
    const [sumCor, setSumCor] = useState(0);
    useEffect(() => {
        const bizValueArr = Object.values(inputValues.biz).map(value =>
            Array.isArray(value) ? value[0] : value // ✅ 배열이면 금액(value[0]), 아니면 그대로 사용
        );
        
        const corValueArr = Object.values(inputValues.cor).map(value =>
            Array.isArray(value) ? value[0] : value // ✅ 배열이면 금액(value[0]), 아니면 그대로 사용
        );
        
       /*  const bizValueArr = Object.values(inputValues.biz);
        const corValueArr = Object.values(inputValues.cor); */
        // const bizValueArr = Object.values(inputValues.biz).map(value => value[0]); // ✅ 금액 값만 추출
        // const corValueArr = Object.values(inputValues.cor).map(value => value[0]); // ✅ 금액 값만 추출

        const bizTotal = bizValueArr.reduce((acc, cur) => acc + cur, 0);
        const corTotal = corValueArr.reduce((acc, cur) => acc + cur, 0);
        
        setSumBiz(bizTotal);
        setSumCor(corTotal);
        inputValuesRef.current = inputValues;
        console.log('inputValues: ', inputValues, '\nbizTotal: ', bizTotal, '\ncorTotal: ', corTotal);
    }, [inputValues]);
    // --------------------- input value 합산 끝 ---------------------  
    // =================== input value 받아오기 끝 ===================
      
    // =================== 선택 버튼 클릭 시 매출 금액과 총 합산 금액 비교 ===================
    const hasDelegateTrue = (data) => {
        const result = {};
    
        Object.keys(data).forEach(greatClassiCode => {
            if (typeof data[greatClassiCode] !== "object") return;
    
            result[greatClassiCode] = Object.values(data[greatClassiCode]).some(
                (arr) => arr[1] === true && arr[2] !== "D"
            );
        });
    
        console.log("hasDelegateTrue result: ", result);
        return result;
    };
    
    const saveData = () => {
        const transformedData = transformData(inputValues);
        const current = inputValuesRef.current;
        if (!transformedData) {
            return;
        }
        console.log('inputValues: ', inputValues, '\ntransformedData', transformedData, '\ncurrent: ', current);
        
        const result = compareAndUpdateModes(transformedData, current); // ✅ `compareAndUpdateModes`의 result를 받음
        const checkNull = hasDelegateTrue(result); // ✅ `hasDelegateTrue`의 결과도 받아서 사용
        // console.log(result, checkNull);
        let total;

        console.log(typeof totalSaleAmt, totalSaleAmt);


        if (typeof totalSaleAmt === 'number' && !isNaN(totalSaleAmt)) {
            total = totalSaleAmt;
        } else {
            total = Number(totalSaleAmt.replace(/,/g, ''));
        }
        console.log(total);
        if (totalSaleAmt === null || totalSaleAmt === undefined) {
            alert('총 매출 금액을 입력하세요.');
            return;
        }
        if (sumBiz !== total) {
            alert('사업 구분 필드의 총 금액은 매출 금액과 일치해야 합니다.');
            return;
        }
        if (sumCor !== total) {
            alert('제조사명 필드의 총 금액은 매출 금액과 일치해야 합니다.');
            return;
        }
        if (checkNull.biz === false) {
            alert('대표 사업 구분을 지정하세요.');
            return;
        }
        if (checkNull.cor === false) {
            alert('대표 제조사명을 지정하세요.');
            return;
        }
        if (!result.a_product_name) {
            alert('제품명을 입력하세요.');
            return;
        }

        setSalesDetailData(() => ({
            // ...current,
            // total: total,
            ...result, // ✅ `compareAndUpdateModes`의 결과를 함께 저장
        }));

        setTimeout(() => {
            onHide(true);
        }, 100);
    };

    // 초기화
    useEffect(()=> {
        console.log(show);
        if (show === false) {
            setSumBiz(0);
            setSumCor(0);
            setInputValues({biz: {}, cor: {}, a_product_name: ''});
            setSelectedBizKeys([]);
            setSelectedCorKeys([]);
            setIsSelected(false);
            setTotalSaleAmt(0);
        }
    }, [show])

    const [totalSaleAmt, setTotalSaleAmt] = useState(0);
/*     useEffect(() => {
        console.log(totalSaleAmt);
    }, [totalSaleAmt])
 */
    const handleTotalChange = (e) => {
        const value = e.target.value;
        const localeValue = value.replace(/,/g, '');
        if (!isNaN(localeValue) && localeValue !== "") {
            setTotalSaleAmt(Number(localeValue).toLocaleString("ko-KR")); // ✅ 한국식 포맷 적용
        } else {
            setTotalSaleAmt(""); // ✅ 빈 값 처리
        }
    }
    
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
                                            <h3>매출 금액: &#65510;{saleMsg ? saleMsg.toLocaleString('ko-KR') : ''}</h3>
                                            <h4 style={{'textAlign':'center'}}>[사업 구분] 필드의 총 금액 / [제조사명] 필드의 총 금액은 각각 [총 매출 금액] 필드 값과 반드시 일치해야 합니다.</h4>
                                            <h4 style={{'textAlign':'center'}}>항목 앞 라디오 버튼으로 대표 사업 구분 / 대표 제조사명을 지정할 수 있습니다. &#40;필수&#41;</h4>
                                        </div>
                                        
                                        <Row className="cntntArea">
                                            <Col xs={12} md={6} lg={6} xl={6} className='col d-flex align-items-center floating'>
                                                <h4>총 매출 금액 &#40;현재 값, &#65510;&#41;: {saleMsg ? saleMsg.toLocaleString('ko-KR') : ''}</h4>
                                            </Col>
                                            <Col xs={12} md={6} lg={6} xl={6} className='col d-flex align-items-center floating'>
                                                <FloatingLabel label='총 매출 금액 &#40;변경 값, &#65510;&#41;'>
                                                    <Form.Control size='sm' type='text' className='' 
                                                    name='a_sale_amt' 
                                                    data-key='biz_opp_detail' 
                                                    placeholder='총 매출 금액 &#40;변경 값, &#65510;&#41;'
                                                    onChange={handleTotalChange} 
                                                    defaultValue={0}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <Row className="cntntArea">
                                            <Col className="cntnt textArea">
                                                <h3 className="mb-4">사업 구분</h3>
                                                <h4>총 매출 금액 &#40;변경 값&#41;: &#65510;{totalSaleAmt.toLocaleString('ko-KR')}</h4>
                                                <h4>현재 사업 구분 금액: &#65510;{sumBiz.toLocaleString('ko-KR')}</h4>
                                                <Tree ref={treeRef} multiple checkStrictly 
                                                treeData={treeRender(bizTreeData, 'biz')} 
                                                onSelect={(selectedKeys, info) => onSelect('biz')(selectedKeys, info)} 
                                                defaultSelectedKeys={v_modalPropsData ? [`${lowerCase(v_modalPropsData.biz_section1_code)}-${propsBizIndex}`] : ''}
                                                /> 
                                            </Col>
                                            <Col className="cntnt">
                                                <h3 className="mb-4">제조사명</h3>
                                                <h4>총 매출 금액 &#40;변경 값&#41;: &#65510;{totalSaleAmt.toLocaleString('ko-KR')}</h4>
                                                <h4>현재 제조사명 금액: &#65510;{sumCor.toLocaleString('ko-KR')}</h4>
                                                <Tree ref={treeRef} multiple checkStrictly 
                                                treeData={treeRender(corTreeData, 'cor')} 
                                                onSelect={(selectedKeys, info) => onSelect('cor')(selectedKeys, info)} 
                                                defaultSelectedKeys={v_modalPropsData ? [`${lowerCase(v_modalPropsData.sale_com1_code)}-${propsCorIndex}`] : ''}
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
                                <Button variant='primary' onClick={saveData}>선택</Button>
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
    }, [listData, bizTreeData, corTreeData, show, onHide, /* selectedBizKeys */, saleMsg, sumBiz, sumCor, totalSaleAmt]);
  
    return (
        <>
        {v_handlingHtml}
        </>
    )
}

export default SalesDetail;