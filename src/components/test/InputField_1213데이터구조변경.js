import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../../redux/reducers/LocationSlice';
import { apiMethods } from '../../utils/api';

import roots from '../../utils/datas/Roots';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';

const InputField = ({ v_componentName, v_propsData }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = useSelector((state) => state.location.currentPath);
    const [v_handlingHtml, setVHandlingHtml] = useState(null);

    const p_search = {
        a_v_sql_headquarters: '',
        a_team: '',
        a_commonness_pro: '',
        a_username: '',
        /* a_user_id: '',
        a_cipher: '', */
    }
    const [input, setInput] = useState(p_search);

    const f_handlingInput = (e) => {
        const { name, value } = e.target;
        // input 업데이트
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value.trim(),
        }));
    } 
    // ================= data 핸들링: bizopp에서 필요한 데이터 배열만 뽑아 오기 ================= 
    const [data, setData] = useState([ ]);
    // 초기 렌더링 시 빈 배열이 그대로 렌더링되어 오류 나는 것을 방지 + tableData 세팅
    useEffect(() => {
        if (!v_propsData || v_propsData.length === 0 || !v_propsData[0][3]) {
        console.warn("v_propsData가 비어 있습니다.");
        return;
        }
        const updatedData = v_propsData[0].slice(0, -1);
        console.log("업데이트된 데이터:", updatedData);

        setData(updatedData); // 상태 업데이트
    }, [v_propsData]);


    // ================= option 1 변경 시 2도 동적으로 변경 ================= 
    // --------- 본부별 팀 매핑 --------- 
    const [depts, setDepts] = useState([]);
    const [teams, setTeams] = useState([]);

    const [teamByDept, setTeamByDept] = useState({});

    function teamLinkedDept () {
        // 구조분해 할당
        const [dataOfDept, dataOfTeam] = data;
                
        setDepts(dataOfDept);
        setTeams(dataOfTeam);

        // 본부별 팀 그룹화 - acc에 high_dept_id가 없을 경우 생성
        const mapping = dataOfTeam.reduce((acc, items) => {
            const { change_preparation_high_dept_id } = items;
            if (!acc[change_preparation_high_dept_id]) {
                acc[change_preparation_high_dept_id] = [];
            }
            acc[change_preparation_high_dept_id].push(items);
            return acc;
        }, {});

        setTeamByDept(mapping);
    }

    const [selectDept, setSelectDept] = useState('');
    const [selectTeam, setSelectTeam] = useState([]);
    // 본부 선택 핸들러
    const handlingDept = (e) => {
        setSelectDept(e.target.value);
        setSelectTeam(teamByDept[e.target.value] || []);
    };
    // --------- 본부별 팀 매핑 끝 --------- 

    
    // --------- From-to 매핑 --------- 
    const [fromPro, setFromPro] = useState('');
    const [toPro, setToPro] = useState('');
    const [selectFromPro, setSelectFromPro] = useState([]);
    const [selectToPro, setSelectToPro] = useState([]);

    const [filteredToPro, setFilteredToPro] = useState([]);
    const handleFromChange = (e) => {
        console.log(e.target.value);
        setSelectFromPro(e.target.value);
        setFilteredToPro(data[2].filter((item) => parseInt(item.small_classi_code) > parseInt(e.target.value)));
        setSelectToPro('');
    }
    const handleToChange = (e) => {
        console.log(e.target.value);
        setSelectToPro(e.target.value);
    }
/*     // "from" 선택 핸들러
    const handleFromChange = (e) => {
        if (e) {
            console.log(e);
            const selectedValue = e.target.value; 
            setFrom(selectedValue);

            // "to" 값이 "from" 값보다 작거나 같다면 초기화
            if (to && selectedValue >= to) {
                setTo("");
            }
        }
        
    };

    // "to" 선택 핸들러
    const handleToChange = (e) => {
        setTo(e.target.value); // 숫자로 변환
    };// "to" 박스에 표시할 옵션 필터링
    // const filteredToOptions = options.filter((option) => option > from); */
    // --------- From-to 매핑 끝 --------- 

    useEffect(() => {
        if (v_propsData.length > 0) {
            if (v_componentName === `bizOpp`) {
                teamLinkedDept(); 
            }
        }
    }, [data]);
/*     // Redux와 React Router 동기화
    useEffect(() => {
        const syncPath = async () => {
            if (!currentPath || currentPath === '/login' || currentPath === '/login/') {
                await dispatch(setLocation(location.pathname)); // Redux 상태 업데이트를 보장
            }
        };
        syncPath();
    }, [currentPath, location.pathname, dispatch]);
    
    console.log(currentPath); */

    

    // UI 업데이트
    useEffect(() => {
        const updateUI = () => {
            if (!currentPath || currentPath === '/login') {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            }
            switch (currentPath) {
                // biz-opp/
                case `/${roots.bizoppSelect1.depth1}/`:
                    setVHandlingHtml(
                        <>
                        <div className='inputField'>
                            <div className='searchItem'>
                                <Row className="d-flex justify-content-between">
                                    <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                        <Form.Label className="">계약 일자</Form.Label>
                                        <div>
                                            <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Control size="sm" type="date" />
                                        </div>
                                    </Col>
                                    <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                        <Form.Label className="">매출 일자</Form.Label>
                                        <div>
                                            <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Control size="sm" type="date" />
                                        </div>
                                    </Col>
                                    <Col xs={12} md={2} lg={2} className='btnArea col d-flex align-items-center justify-content-end'>
                                        <Button variant='info btnLeft'>조회</Button>
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-between">
                                    <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                        <Form.Label className="">진행률</Form.Label>
                                        <div>
                                            <Form.Select size='sm' aria-label='selectBox' className='pro_1' id="fromSelect" value={selectFromPro} onChange={handleFromChange}>
                                                <option>선택</option>
                                                {(data.length > 0 ? 
                                                    (
                                                        data[2].map((e) => {
                                                            return <option value={e.small_classi_code}>{e.small_classi_name}</option>
                                                        })
                                                    )
                                                    :
                                                    ('')
                                                )}
                                            </Form.Select>
                                            <span style={{margin: '0 10px'}}>~</span>
                                            <Form.Select size='sm' aria-label='selectBox' className='pro_2'  id="fromSelect" value={selectToPro} onChange={handleToChange}>
                                                <option>선택</option>
                                                {(data.length > 0 ? 
                                                    (
                                                        filteredToPro.map((e) => {
                                                            return <option value={e.small_classi_code}>{e.small_classi_name}</option>
                                                        })
                                                    )
                                                    :
                                                    ('')
                                                )}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                        <Form.Label for='inputChck' className="">필달 여부</Form.Label>
                                        <Form.Check type={`checkbox`} id={`inputChck`}/>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-between">
                                    <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                        <Form.Label className="">본부</Form.Label>
                                        <Form.Select id="select1" onChange={handlingDept} value={selectDept} size='sm' aria-label='selectBox'>
                                            <option value="">-- 본부를 선택하세요 --</option>
                                            {(data.length > 0 ? 
                                            (
                                                depts.map((dept) => (
                                                <option key={dept.change_preparation_dept_id} value={dept.change_preparation_dept_id}>
                                                    {dept.change_preparation_dept_name}
                                                </option>
                                                ))
                                            )
                                            :
                                            ('')
                                            )}
                                            {/* {(data.length > 0 ? 
                                                (
                                                    data[0].map((e) => {
                                                        return <option value={e.change_preparation_dept_id}>{e.change_preparation_dept_name}</option>
                                                    })
                                                )
                                                :
                                                (console.log('data Loading'))
                                            )} */}
                                            {/* <option value="1000000">1000000</option>
                                            <option value="1100000">1100000</option>
                                            <option value="1110000">1110000</option>
                                            <option value="1120000">1120000</option>
                                            <option value="1130000">1130000</option>
                                            <option value="1140000">1140000</option>
                                            <option value="1150000">1150000</option> */}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                        <Form.Label className="">팀</Form.Label>
                                        <Form.Select id='select2' size='sm'  /* value={option2} onChange={handleSelect2Change} aria-label='selectBox' disabled={options.length === 0}   */disabled={!selectTeam.length}>
                                            <option value="">-- 팀을 선택하세요 --</option>
                                            {selectTeam.map((team) => (
                                                <option key={team.change_preparation_dept_id} value={team.change_preparation_dept_id}>
                                                    {team.change_preparation_dept_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                        <Form.Label className=''>영업 담당자</Form.Label>
                                        <Form.Control size='sm' type='text' placeholder='담당자명을 입력하세요' value={input.a_username}/>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        </>
                    );
                    break;
                /* case `/${roots.bizoppHistory.depth1}/`:
                    setVHandlingHtml(
                        <>
                            <div className='inputField'>
                                <div className='searchItem'>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">계약 일자</Form.Label>
                                            <div>
                                                <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                                <span style={{margin: '0 10px'}}>~</span><Form.Control size="sm" type="date" />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={12} lg={5} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">매출 일자</Form.Label>
                                            <div>
                                                <Form.Control size="sm" type="date" label="FROM" className="" name="" value=""/>
                                                <span style={{margin: '0 10px'}}>~</span><Form.Control size="sm" type="date" />
                                            </div>
                                        </Col>
                                        <Col xs={12} md={2} lg={2} className='btnArea col d-flex align-items-center justify-content-end'>
                                            <Button variant='info btnLeft'>조회</Button>
                                        </Col>
                                    </Row>
                                    <Row className="d-flex justify-content-between">
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">본부</Form.Label>
                                            <Form.Select size='sm' aria-label='selectBox'>
                                                <option>선택</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className="">팀</Form.Label>
                                            <Form.Select size='sm' aria-label='selectBox'>
                                                <option>선택</option>
                                                <option value='1'>One</option>
                                                <option value='2'>Two</option>
                                                <option value='3'>Three</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                            <Form.Label className=''>영업 담당자</Form.Label>
                                            <Form.Control size='sm' type='text' placeholder='Default input' />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </>
                    );
                    break;
                     */
                default:
                    setVHandlingHtml(<h1>안녕하세요 InputField.js 작업 중입니다.</h1>);
            }
        };

        updateUI();
    }, [currentPath, data, depts, selectTeam, selectFromPro, selectToPro]);

    return (
        <div id='search' className='wrap'>
            {v_handlingHtml}
        </div>
    );
};

export default InputField;
