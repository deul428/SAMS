import { Form, FloatingLabel, Modal, Button, Row, Col, CloseButton } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Tree from 'rc-tree';

import 'rc-tree/assets/index.css';
import '../styles/_customModal.scss';
import '../styles/_tree.scss';
import '../styles/_button.scss';
import { endsWith, lowerCase, sum, toLower, update } from "lodash";

const SalesDetail = ({ isParentHide, v_treeName, show, onHide, listData, v_modalPropsData, v_propsSaleList, setSalesDetailData, isDeleted }) => {
    const auth = useSelector((state) => state.auth);
    // =================== 렌더 시 세팅 ===================  
    // -------------------- 기본 데이터 핸들링 --------------------
    /* 
    listBizData: props된 리스트 데이터의 biz section code 배열
    listCorData: props된 리스트 데이터의 last client com code 배열 
    propsBizIndex: props된 단건 데이터 - 리스트 데이터 비교해 일치할 경우 그 인덱스를 저장. 이후 UI에서 defaultSelectedKeys 지정에 사용.
    propsCorIndex: props된 단건 데이터 - 리스트 데이터 비교해 일치할 경우 그 인덱스를 저장. 이후 UI에서 defaultSelectedKeys 지정에 사용.
    */
   
    // props된 saleData를 상태변수에 저장 - null일 경우 return
    // case 복제의 경우에는 부모 컴포넌트에서 select-biz-opp-activity3 엔드포인트로 호출하지만 propsSaleList는 존재하지 않음.

    const [listBizData, setListBizData] = useState([]);
    const [listCorData, setListCorData] = useState([]);
    useEffect(() => {
        if (listData) {
            setListBizData(listData.data.search_biz_section_code);
            setListCorData(listData.data.search_last_client_com_code);
        }
    }, [listData]);
    

    // props된 매출 상세 데이터 저장
    const [v_propsSaleData, setVPropsSaleData] = useState([]);
    useEffect(() => {
        console.log("v_propsSaleList: ", v_propsSaleList);
        if (v_propsSaleList) {
            setVPropsSaleData(v_propsSaleList);
        } else {
            setVPropsSaleData([]);
        }
    }, [v_propsSaleList])

    const [propsBizData, setPropsBizData] = useState([]);
    const [propsCorData, setPropsCorData] = useState([]);

    const [defaultBizKeys, setDefaultBizKeys] = useState([]);
    const [defaultCorKeys, setDefaultCorKeys] = useState([]);
    // props 데이터가 있지만 isSave / show false일 경우에 propsSaleData를 의존성 배열로 사용하는 useEffect 훅이 감지할 수 있도록 보낼 플래그
    const [isRecover, setIsRecover] = useState(false);
    // v_propsSaleData 변경 감지 (기존 로직 유지)
    useEffect(() => {
        if (v_propsSaleData.length !== 0 && v_modalPropsData) {
            console.log("v_propsSaleData:", v_propsSaleData, "v_modalPropsData: ", v_modalPropsData);

            if (v_propsSaleData[0][0].biz_opp_id !== v_modalPropsData.biz_opp_id) {
                return;
            }
            if (v_propsSaleData[0][0].detail_no !== v_modalPropsData.detail_no) {
                return;
            }

            setPropsBizData(v_propsSaleData[0]);
            setPropsCorData(v_propsSaleData[1]);

            const transformedData = {
                biz: {},
                cor: {},
                a_product_name: ""
            };

            v_propsSaleData[0].forEach(item => {
                if (item.great_classi_code === "BIZ") {
                    const smallClassiCode = item.small_classi_code;
                    transformedData.biz[smallClassiCode] = [
                        item.small_classi_name || "알 수 없음",
                        item.sale_amt,
                        item.delegate_tf
                    ];
                }
            });

            v_propsSaleData[1].forEach(item => {
                if (item.great_classi_code === "COR") {
                    const smallClassiCode = item.small_classi_code;
                    transformedData.cor[smallClassiCode] = [
                        item.small_classi_name,
                        item.sale_amt,
                        item.delegate_tf
                    ];
                }
            });

            console.log("변환된 데이터:", transformedData);

            // 초기 로딩 또는 데이터 업데이트
            if (!isRecover) {
                console.log('🌟 v_propsData가 초기에 들어왔음', v_propsSaleData);
                setInputValues(prev => ({
                    ...prev,
                    biz: {
                        ...prev.biz,
                        ...transformedData.biz
                    },
                    cor: {
                        ...prev.cor,
                        ...transformedData.cor
                    },
                    a_product_name: v_modalPropsData?.product_name || prev.a_product_name
                }));
            }
        } else {
            // 신규 등록 혹은 데이터 로딩 
            // console.log('loading...');
            setInputValues({ biz: {}, cor: {}, a_product_name: "" });
            return;
        }
    }, [v_propsSaleData, v_modalPropsData]);


    // isRecover 변경 감지: 기존 데이터로 강제 원복
    useEffect(() => {
        if (isRecover) {
            console.log("isRecover 활성화: 수정 전 데이터로 복원!", v_propsSaleData);

            if (v_propsSaleData.length !== 0) {
                const transformedData = {
                    biz: {},
                    cor: {},
                    a_product_name: ""
                };

                v_propsSaleData[0].forEach(item => {
                    if (item.great_classi_code === "BIZ") {
                        const smallClassiCode = item.small_classi_code;
                        transformedData.biz[smallClassiCode] = [
                            item.small_classi_name || "알 수 없음",
                            item.sale_amt,
                            item.delegate_tf
                        ];
                    }
                });

                v_propsSaleData[1].forEach(item => {
                    if (item.great_classi_code === "COR") {
                        const smallClassiCode = item.small_classi_code;
                        transformedData.cor[smallClassiCode] = [
                            item.small_classi_name,
                            item.sale_amt,
                            item.delegate_tf
                        ];
                    }
                });

                console.log("원복할 데이터:", transformedData);

                setInputValues({
                    biz: transformedData.biz,
                    cor: transformedData.cor,
                    a_product_name: v_modalPropsData?.product_name || ""
                });

                // 원복 완료 후 isRecover 해제
                setIsRecover(false);
            }
        }
    }, [isRecover]);

    // -------------------- 트리 UI 렌더링 --------------------
    const treeRender = (listData, propsData, type) => {
        const propsMap = new Map(propsData.map(e => [e.small_classi_code, { sale_amt: e.sale_amt, delegate_tf: e.delegate_tf }]));
        return listData.map((e, index) => {
            const matchedData = propsMap.get(e.small_classi_code) || { sale_amt: 0, delegate_tf: false };
            const prepareCode = inputValues[e.great_classi_code.toLowerCase()][e.small_classi_code];
            let selectedRadio;
            if (isSave === true) {
                if (prepareCode?.[2] === true) {
                    selectedRadio = prepareCode?.[2];
                }
            } else {
                selectedRadio = matchedData.delegate_tf;
            }
            
            return {
                title: (
                    <div className="titleArea"
                        data-key={e.small_classi_name}>
                        <input 
                            type="radio"
                            name={`radio-${type}`}
                            data-key={e.small_classi_name}
                            data-code={e.small_classi_code}
                            onChange={(e) => handleInputChange(e, type, e.target.dataset.code, true)}
                            onClick={(e) => checkSelect(e)} 
                            defaultChecked={
                                isSave ?
                                selectedRadio :
                                v_propsSaleData && v_propsSaleData[1]?.length > 0 ?
                                matchedData.delegate_tf : 
                                false
                            }
                        />
                        <div className={`${index} titleItem`} data-key={`${type}-${index}`}>
                            <span>{e.small_classi_name}</span>
                            <input
                                type="number"
                                placeholder="세부 금액"
                                value={prepareCode?.[1] ?? 0}
                                defaultValue={matchedData.sale_amt}
                                data-key={e.small_classi_name}
                                data-code={e.small_classi_code}
                                onChange={(e) => {handleInputChange(e, type, e.target.dataset.code, false)}}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                ),
                key: `${type}-${e.small_classi_code}`,
                small_classi_code: e.small_classi_code
            }
        })
        
    }
    
    // =================== 렌더 시 세팅 끝 ===================  

    
    // =================== onSelect 시 핸들링 ===================  
    const [forceRender, setForceRender] = useState(0);
    // radio 버튼 클릭 시 UI에 노드 select 클래스 추가
    const checkSelect = (e) => {
        e.stopPropagation();
        e.target.parentElement.parentElement.parentElement.classList.add('rc-tree-node-selected');
    };
    // onSelect 시 해당 key 저장, 현재로서는 필요없어 보이는데 나중에 사용할까 봐 남겨 둠.
    const [selectedBizKeys, setSelectedBizKeys] = useState([]);
    const [selectedCorKeys, setSelectedCorKeys] = useState([]);

    // selected flag
    const [isSelected, setIsSelected] = useState([]);

    const treeRef = useRef(null);
    const onSelect = (type) => (selectedKeys, info) => {
        if (type !== 'biz' && type !== 'cor') return;

        setIsSelected(info.selected);
        
        type === "biz" ? setSelectedBizKeys(selectedKeys) : setSelectedCorKeys(selectedKeys);

        const classiName = info.node?.title?.props?.["data-key"];
        const classiCode = info?.node?.small_classi_code;
        console.log(info.selected, classiName);
        // onSelect로 호출한 node가 selected true인 경우 inputValues 객체에 키와 값을 추가 - 이미 키가 있으면 값만 업데이트 / false일 경우 키와 값을 삭제
        console.log(info.node, info.node.title.props);
        // 만약 radio가 체크된 상태로 해당 노드를 selected false한 경우 radio도 false
        if (info.selected) {

        }
        setInputValues((prev) => {
            const prevInput = prev[type] ? { ...prev[type] } : {};
            if (info.selected) {
                prevInput[classiCode] = Array.isArray(prevInput[classiCode])
                    ? [classiName, prevInput[classiCode][1], prevInput[classiCode][2] ?? false]
                    : [classiName, 0, false];
            } else {
                delete prevInput[classiCode];
            }
    
            return {
                ...prev,
                [type]: prevInput
            };
        });

        setForceRender(n => n+1);
    };

    // 선택 해제된 classiCode는 UI에서 0으로 유지. 이 코드가 없을 시 selected된 요소를 false했다 true할 시 inputValues 객체는 숫자가 0으로 초기화되지만 UI는 초기화되지 않음. inputValues 값 및 UI 표현 값을 보존하기 위해 사용.
    useEffect(() => {
        // console.log("isSelected: ", isSelected, /* inputNumValue */);
        setForceRender(n => n+1);
        // console.log(forceRender);
        if (isSelected === false) {
            setInputValues((prev) => {
                return {
                    ...prev,
                    biz: { ...prev.biz },
                    cor: { ...prev.cor },
                    a_product_name: prev.a_product_name
                };
            });
            // setInputNumValue(0);
        } 
    }, [isSelected]);
    // =================== onSelect 시 핸들링 끝 ===================  

    // =================== input value 받아와서 업데이트 ===================  
    // input key: 해당 객체의 code 값 / value: e.target.value의 classiName(string), input number(int), radio t/f(boolean)
    const [inputValues, setInputValues] = useState({biz: {}, cor: {}, a_product_name: ''});

/*     const sampleData = [
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
 */
    const handleInputChange = (e, type, classiCode, isRadio = false) => {
        const classiName = e.currentTarget.dataset.key;
        // console.log(e, type, classiCode, isRadio);
        setInputValues((prev) => {
            // type이 `a_product_name`일 경우 단순히값 저장 후 return
            if (type === "a_product_name") {
                return {
                    ...prev,
                    a_product_name: e.target.value
                };
            } 
            
            const prevInput = { ...prev[type] };
    
            // input radio
            if (isRadio) {
                // 모든 기존 항목을 false로 변경 (라디오 버튼 단일 선택 유지)
                Object.keys(prevInput).forEach((prevClassiCode) => {
                    prevInput[prevClassiCode] = Array.isArray(prevInput[prevClassiCode])
                        ? [prevInput[prevClassiCode][0], prevInput[prevClassiCode][1], false]
                        : [prevInput[prevClassiCode][0], 0, false];
                });

                // 선택된 항목만 true로 설정
                prevInput[classiCode] = Array.isArray(prevInput[classiCode])
                    ? [prevInput[classiCode][0], prevInput[classiCode][1], true]
                    : [classiName, 0, true];
            } else { 
                // input radio X(number): 입력 시 number만 업데이트 유지
                prevInput[classiCode] = Array.isArray(prevInput[classiCode])
                    ? [prevInput[classiCode][0], Number(e.target.value), prevInput[classiCode][2] ?? false]
                    : [classiName, Number(e.target.value), false];
            }
    
            return {
                ...prev,
                [type]: prevInput
            };
        });
    };
    

    
    // --------------------- input value 합산 ---------------------  
    const inputValuesRef = useRef(inputValues);
    const [sumBiz, setSumBiz] = useState(null);
    const [sumCor, setSumCor] = useState(null);
    useEffect(() => {
        // 특정 타입(biz 또는 cor)의 합계를 계산
        const calculateTotal = (type) => {
            return Object.values(inputValues[type])
                .filter(value => Array.isArray(value)) // 배열인 항목만 필터링
                .reduce((acc, cur) => acc + cur[1], 0); // 두 번째 요소(금액) 합산
        };
        const bizTotal = calculateTotal('biz');
        const corTotal = calculateTotal('cor');
        setSumBiz(bizTotal);
        setSumCor(corTotal);

        inputValuesRef.current = inputValues; //최신 값 보장
        
        // 이 모달 저장 후 나갔다가 다시 모달 열 경우 selected 유지
        setTimeout(() => {
            setDefaultBizKeys(
                Object.keys(inputValues.biz)
                    .map(e => e/* ?.small_classi_code */)
                    .filter(Boolean)
            );
            setDefaultCorKeys(
                Object.keys(inputValues.cor)
                    .map(e => e/* ?.small_classi_code */)
                    .filter(Boolean)
            );
        }, 0);

        console.log('inputValues: ', inputValues, '\nbizTotal: ', bizTotal, '\ncorTotal: ', corTotal);
    }, [inputValues]);
    // --------------------- input value 합산 끝 ---------------------  
    // =================== input value 받아와서 업데이트 끝 ===================
      
    // =================== 선택 버튼 클릭 시 ===================
    // inputValues로 저장해 둔 데이터 구조 변경
    const transformPrevData = (data) => {
        console.log("transformData func, raw data: ", data);
        const result = {};
    
        if (data.length > 0) { 
            data.forEach((value) => {
                value.map((e) => {
                    // console.log(e, typeof e);
                    const lowerCode = e.great_classi_code ? e.great_classi_code.toLowerCase() : null; 
                    if (!lowerCode) { return; }
                    if (!result[lowerCode]) {
                        result[lowerCode] = {};
                    }
                    const small_classi_code = e.small_classi_code;
                    if (!small_classi_code) {
                        console.warn("small_classi_code가 없음:", e);
                        return;
                    }
                    const small_classi_name = e.small_classi_name;
                    const sale_amt = e.sale_amt;
                    const delegate_tf = e.delegate_tf;
                    result[lowerCode][small_classi_code] = [small_classi_name, sale_amt, delegate_tf];
                    // console.log([small_classi_name, sale_amt, delegate_tf]);
                })
            });
        }
        /* if (data.biz || data.cor) { 
            Object.entries(data).forEach(([key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) { 
                    // biz, cor 내부 객체 순회
                    Object.entries(value).forEach(([small_classi_code, arr]) => {
                        const [small_classi_name, sale_amt, delegate_tf] = arr;
    
                        const lower = key.toLowerCase(); // great_classi_code 대체
                        if (!result[lower]) {
                            result[lower] = {}; //  키가 없으면 초기화
                        }
    
                        result[lower][small_classi_code] = [small_classi_name, sale_amt, delegate_tf]; //  값 추가
                    });
                }
            });
        } */
        console.log("transformData func, data: ", result);
        
        return result;
    };

    // a_mode 추가
    const addMode = (initialData, updatedData) => {
        console.log("addMode \ninitialData: ", initialData, "\nupdatedData: ", updatedData);
        let result = JSON.parse(JSON.stringify(updatedData));
    
        // 초기 데이터가 없는 경우 모든 값에 "I" 추가
        if (Object.keys(initialData).length === 0) {
            Object.keys(updatedData).forEach(great => {
                if (typeof updatedData[great] === "string") {
                    result[great] = updatedData[great]; // 문자열 값은 그대로 저장
                    return;
                }
    
                Object.keys(updatedData[great]).forEach(small => {
                    if (!Array.isArray(result[great][small])) {
                        result[great][small] = [...updatedData[great][small]];
                    }
                    if (!result[great][small].includes('I')) {
                        result[great][small].push('I'); //  추가됨
                    }
                });
            });

            return result;
        }
    
        // 기존 데이터가 존재하는 경우 비교 로직 실행
        Object.keys(updatedData).forEach(great => {
            if (typeof updatedData[great] === "string") {
                result[great] = updatedData[great]; // 문자열 값은 그대로 저장
                return;
            }
    
            if (!initialData.hasOwnProperty(great)) {
                // 새로운 대분류 항목이면 모든 값에 "I" 추가
                Object.keys(updatedData[great]).forEach(small => {
                    if (!result[great]) {
                        result[great] = {}; // 대분류 초기화
                    }
                    if (!Array.isArray(result[great][small])) {
                        result[great][small] = [...updatedData[great][small]];
                    }
                    if (!result[great][small].includes('I')) {
                        result[great][small].push('I'); //  신규 추가 감지
                    }
                });
            } else {
                // 기존에 존재하는 경우 세부 항목 비교
                Object.keys(updatedData[great]).forEach(small => {
                    if (!initialData[great]?.hasOwnProperty(small)) {
                        // 신규 항목이면 "I" 추가
                        if (!result[great]) {
                            result[great] = {}; // 대분류 초기화
                        }
                        if (!Array.isArray(result[great][small])) {
                            result[great][small] = [...updatedData[great][small]];
                        }
                        if (!result[great][small].includes('I')) {
                            result[great][small].push('I'); //  신규 추가 감지
                        }
                    } else {
                        // 기존 데이터가 존재할 경우, 세부 값 비교 후 "U" 추가
                        const [prevName, prevAmount, prevRadio] = initialData[great][small] || ["", 0, false];
                        const [newName, newAmount, newRadio] = updatedData[great][small];
    
                        if (prevName !== newName || prevAmount !== newAmount || prevRadio !== newRadio) {
                            if (!result[great][small].includes('U')) {
                                result[great][small].push('U'); //  업데이트 감지
                            }
                        }
                    }
                });
    
                // 기존 데이터 중 `updatedData`에 없는 항목은 삭제(`D`) 처리
                Object.keys(initialData[great]).forEach(small => {
                    if (!updatedData[great]?.hasOwnProperty(small)) {
                        result[great][small] = [...initialData[great][small], 'D']; //  삭제 감지
                    }
                });
            }
        });
        console.log('addmode result: ', result);
        return result;
    };
    
    // radio 유효값 검사 - 대표 true 체크
    const hasDelegateTrue = (data) => {
        const result = {};
        Object.keys(data).forEach(great => {
            if (typeof data[great] !== "object") return;
    
            result[great] = Object.values(data[great]).some(
                (arr) => arr[2] === true && arr[3] !== "D"
            );
        });
        return result;
    };
    
    const [isSave, setIsSave] = useState(false);
    const saveData = () => {
        const current = inputValuesRef.current;

        let transformedData;
        // console.log(v_propsSaleData, v_propsSaleData.length);
        if (v_propsSaleData && v_propsSaleData.length > 0 && (v_propsSaleData[0]?.length > 0 || v_propsSaleData[1]?.length > 0)) {
            transformedData = transformPrevData(v_propsSaleData);
        } else {
            transformedData = {};
        }
        const finalData = addMode(transformedData, current);
        const finalDataCheck = hasDelegateTrue(finalData);
        console.log('inputValues: ', inputValues, '\ntransformedData', transformedData, '\ncurrent: ', current);

        let total;
        if (sumBiz !== sumCor) {
            alert('사업 구분 필드의 총 금액은 제조사명 필드의 총 금액과 일치해야 합니다.'); return;
        } else {
            total = sumBiz;
        }
        /* if (typeof totalSaleAmt === 'number' && !isNaN(totalSaleAmt)) {
            total = totalSaleAmt;
        } else {
            total = Number(totalSaleAmt.replace(/,/g, ''));
        }
        
        if (totalSaleAmt === null || totalSaleAmt === undefined) { alert('총 매출 금액을 입력하세요.'); return; } */
        // if (sumCor !== total) { alert('제조사명 필드의 총 금액은 매출 금액과 일치해야 합니다.'); return; }
        if (finalDataCheck.biz === false) { alert('대표 사업 구분을 지정하세요.'); return; }
        if (finalDataCheck.cor === false) { alert('대표 제조사명을 지정하세요.'); return; }
        if (!finalData.a_product_name) { alert('제품명을 입력하세요.'); return; }

        setSalesDetailData(() => ({
            // ...current,
            total: total,
            ...finalData, //  `addMode`의 결과를 함께 저장
        }));
        setIsSave(true);
        setTimeout(() => {
            onHide(true);
        }, 100);
    };

    const hideMsg = () => {
        if (auth.userAuthCode === '0002' || isDeleted === true) {
            onHide(true);
        } else {
            if (window.confirm('저장하지 않고 나갈 시 데이터가 초기화됩니다. 정말 창을 닫으시겠습니까?')) {
                onHide(true);
                setIsSave(false);
            } else {
                return;
            }
        }
    }

    const prevShow = useRef(false);
    // 초기화
    useEffect(() => {
        // 초기 렌더링 시 초기화 방지
        if (!prevShow.current && show === false) {
            console.log("모달이 처음 로드됨 (초기화 방지)");
            prevShow.current = show;  // 이전 상태 업데이트
            return;
        }
        /* 
        case 1. 부모 모달이 닫혔을 경우: show F / isSave F / isParentHide T
        case 2. 부모 모달은 열려 있지만 이 모달이 '선택' 버튼 클릭으로 닫혔을 경우: show F / isSave T / isParentHide F
        case 3. 부모 모달은 열려 있지만 이 모달이 '닫기' 버튼 클릭으로 닫혔을 경우: show F / isSave F / isParentHide F
        
        case 1은 데이터 완전히 초기화.
        case 2는 데이터 그대로 유지.
        case 3은 부모 컴포넌트에서 온 propsData가 있을 경우 그 데이터로 렌더링(3-1). 없을 경우 select 안 된 UI로 렌더링.(3-2)
        */
        // 이 모달을 나간 경우
        if (show === false) {
            // 이 모달에서 작업한 내용을 저장하지 않은 경우
            if (isSave === false) {
                console.log("모달 닫힘 & 저장 안 함: 이전 데이터 복원");
                // 만약 v_propsSaleList가 없다면 (신규 등록의 경우) 모든 작업 내용 초기화
                if (!v_propsSaleList || v_propsSaleList.length === 0) {
                    console.log("데이터 없음 → 초기화");
                    setVPropsSaleData([]);
                    setSumBiz(null);
                    setSumCor(null);
                    setInputValues({ biz: {}, cor: {}, a_product_name: "" });
                    setSelectedBizKeys([]);
                    setSelectedCorKeys([]);
                    setIsSelected(false);
                    setDefaultBizKeys([]);
                    setDefaultCorKeys([]);
                    setSalesDetailData([]);
                    setIsRecover(false);
                } else { //v_propsSalesList가 있다면 (수정의 경우) 원래 내용으로 원복
                    console.log("propsData 기반으로 상태 복원");
                    setVPropsSaleData([]);
                    setVPropsSaleData(v_propsSaleList);
                    setIsRecover(true);
                }
            // 선택 시
            } else {

            }
        }
        // 이전 상태 업데이트
        prevShow.current = show;
    }, [show, isSave, v_propsSaleList]);

    useEffect(() => {
        // console.log('isParentHide', isParentHide);
        // 부모 모달이 닫힌 경우 
        if (isParentHide === true) {
            setIsSave(false); 
            setIsRecover(false);
            setVPropsSaleData([]);
            setSumBiz(null);
            setSumCor(null);
            setInputValues({ biz: {}, cor: {}, a_product_name: "" });
            setSelectedBizKeys([]);
            setSelectedCorKeys([]);
            setIsSelected(false);
            setDefaultBizKeys([]);
            setDefaultCorKeys([]);
            setSalesDetailData([]);
        } 
    }, [isParentHide])
    // UI 업데이트
    const [v_handlingHtml, setVHandlingHtml] = useState(null);
    useEffect(() => {
        const updateUI = () => { 
            if (listBizData.length > 0 && listCorData.length > 0) {
                if (v_treeName === 'product') {
                    setVHandlingHtml(
                        <Modal size='xl' show={show} onHide={onHide} id='salesDetail' scrollable backdrop='static'>
                            <Modal.Header>
                                <Modal.Title className='fs-3'>
                                    매출 상세 관리
                                </Modal.Title>
                                <CloseButton onClick={hideMsg} />
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
                                <div className='modalcntnt' style={(auth.userAuthCode === '0002' || isDeleted === true) ? ({"pointerEvents": "none"}) : ({})}>
                                    <div className="inputField">
                                        {/* <div className="searchItem">
                                            <FloatingLabel label='검색' controlId="floatingInput">
                                                <Form.Control size='sm' type='text' placeholder="검색" />
                                            </FloatingLabel>
                                            <Button variant='info'>조회</Button>
                                        </div> */}
                                        <div className="mb-4">
                                            <h4>&#91;사업 구분&#93; 필드의 총 금액과 &#91;제조사명&#93; 필드의 총 금액은 서로 일치해야 합니다.</h4>
                                            <h4>항목 앞 라디오 버튼으로 대표 사업 구분 &#47; 대표 제조사명을 지정할 수 있습니다. &#40;필수&#41;</h4>
                                        </div>
                                        
                                        <Row className="cntntArea mb-2">
                                            <Col xs={12} md={12} lg={12} xl={12} className='col d-flex align-items-center floating'>
                                                {v_modalPropsData ? 
                                                    <h3>총 매출 금액 &#40;수정 전 값&#41;: &#65510;{v_modalPropsData?.total_sale_amt.toLocaleString('ko-KR')}</h3>
                                                : <></>
                                                }
                                                {/* <h3>총 매출 금액 &#40;수정 전 값&#41;: {v_modalPropsData ? 
                                                String.fromCharCode(65510) + v_modalPropsData?.total_sale_amt.toLocaleString('ko-KR') : ''}</h3> */}
                                            </Col>
                                            {/* <Col xs={12} md={6} lg={6} xl={6} className='col d-flex align-items-center floating'>
                                                <FloatingLabel label='총 매출 금액 &#40;변경 값, &#65510;&#41;'>
                                                    <Form.Control size='sm' type='text' className='' 
                                                    name='a_sale_amt' 
                                                    data-key='biz_opp_detail' 
                                                    placeholder='총 매출 금액 &#40;변경 값, &#65510;&#41;'
                                                    onChange={handleTotalChange} 
                                                    defaultValue={0}
                                                    />
                                                </FloatingLabel>
                                            </Col> */}
                                        </Row>
                                        <Row className="cntntArea">
                                            <Col xs={12} md={12} lg={6} xl={6} className="cntnt textArea">
                                                <h3 className="mb-4">사업 구분</h3>
                                                {/* <h4>총 매출 금액 &#40;변경 값&#41;: &#65510;{totalSaleAmt.toLocaleString('ko-KR')}</h4> */}
                                                <h4>현재 사업 구분 금액: &#65510;
                                                    {typeof sumBiz === 'number' && sumBiz >= 0 ? sumBiz.toLocaleString('ko-KR') : v_modalPropsData?.total_sale_amt.toLocaleString('ko-KR')}
                                                </h4>
                                                <Tree ref={treeRef} multiple checkStrictly 
                                                treeData={treeRender(listBizData, propsBizData, 'biz')} 
                                                onSelect={(selectedKeys, info) => onSelect('biz')(selectedKeys, info)} 
                                                defaultSelectedKeys={defaultBizKeys.map((e) => `biz-${e}`)}
                                                // defaultSelectedKeys={v_modalPropsData ? [`biz-${propsBizIndex}`] : ''}
                                                // defaultSelectedKeys={v_modalPropsData ? [`${lowerCase(v_modalPropsData.biz_section1_code)}-${propsBizIndex}`] : ''}
                                                /> 
                                            </Col>
                                            <Col xs={12} md={12} lg={6} xl={6} className="cntnt">
                                                <h3 className="mb-4">제조사명</h3>
                                                {/* <h4>총 매출 금액 &#40;변경 값&#41;: &#65510;{totalSaleAmt.toLocaleString('ko-KR')}</h4> */}
                                                <h4>
                                                    현재 제조사명 금액: &#65510;
                                                    {typeof sumCor === 'number' && sumCor >= 0 ? sumCor.toLocaleString('ko-KR') : v_modalPropsData?.total_sale_amt.toLocaleString('ko-KR')}
                                                </h4>
                                                <Tree ref={treeRef} multiple checkStrictly 
                                                treeData={treeRender(listCorData, propsCorData, 'cor')} 
                                                onSelect={(selectedKeys, info) => onSelect('cor')(selectedKeys, info)} 
                                                defaultSelectedKeys={defaultCorKeys.map((e) => `cor-${e}`)}
                                                // defaultSelectedKeys={v_modalPropsData ? [`cor-${propsCorIndex}`] : ''}
                                                // defaultSelectedKeys={v_modalPropsData ? [`${lowerCase(v_modalPropsData.sale_com1_code)}-${propsCorIndex}`] : ''}
                                                /> 
                                            </Col>
                                        </Row>
                                        <Row className="cntntArea">
                                            <Col className="cntnt product">
                                                <FloatingLabel label='제품명 (제품 비고)'>
                                                    <Form.Control size='sm' type='text' className=''
                                                    name='a_product_name' 
                                                    placeholder='제품명 (제품 비고)'
                                                    onChange={(e) => handleInputChange(e, 'a_product_name', null)}
                                                    defaultValue={v_modalPropsData?.product_name || inputValues.a_product_name || ''}
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
                                {(auth.userAuthCode === '0002' || isDeleted === true) ?
                                    <></> :
                                    <Button variant='primary' onClick={saveData}>선택</Button>}
                                <Button variant="secondary" onClick={hideMsg}>
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
    }, [listData, listBizData, listCorData, show, onHide, /* selectedBizKeys */, sumBiz, sumCor, /* totalSaleAmt */], isDeleted);
  
    return (
        <>
        {v_handlingHtml}
        </>
    )
}

export default SalesDetail;