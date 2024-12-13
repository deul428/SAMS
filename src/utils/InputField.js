import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../redux/reducers/LocationSlice';
import { apiMethods } from './api';

import roots from './datas/Roots';
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
    const [data, setData] = useState([]);
    // 초기 렌더링 시 빈 배열이 그대로 렌더링되어 오류 나는 것을 방지 + tableData 세팅
    useEffect(() => {
        if (!v_propsData || Object.keys(v_propsData).length === 0) {
            console.warn("v_propsData가 비어 있습니다.");
            return;
        }
        const { retrieve_biz_opp, ...filter } = v_propsData.data;
        setData(filter); // 상태 업데이트
    }, [v_propsData]);


    // ================= option 1 변경 시 2도 동적으로 변경 ================= 
    // --------- 본부별 팀 매핑 --------- 
    const [depts, setDepts] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamByDept, setTeamByDept] = useState({});

    const teamLinkedDept = () => {
        setDepts(data.search_headquarters);
        setTeams(data.search_team);

        // 본부별 팀 그룹화 - acc에 high_dept_id가 없을 경우 생성
        const mapping = data.search_team.reduce((acc, items) => {
            const { high_dept_id } = items;
            if (!acc[high_dept_id]) {
                acc[high_dept_id] = [];
            }
        acc[high_dept_id].push(items);
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
    const [selectFromPro, setSelectFromPro] = useState([]);
    const [selectToPro, setSelectToPro] = useState([]);
    const [filteredToPro, setFilteredToPro] = useState([]);
    const handleFromChange = (e) => {
        setSelectFromPro(e.target.value);
        setFilteredToPro(data.search_commonness_pro.filter((item) => parseInt(item.small_classi_code) > parseInt(e.target.value)));
        setSelectToPro('');
    }
    const handleToChange = (e) => {
        console.log(e.target.value);
        setSelectToPro(e.target.value);
    }
    // --------- From-to 매핑 끝 --------- 

    useEffect(() => {
        if (Object.keys(data).length > 0) {
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
            /* if (!currentPath || currentPath === '/login') {
                setVHandlingHtml(<h1>경로를 설정하는 중입니다...</h1>);
                return;
            } */
            switch (v_componentName) {
                // biz-opp/
                case `bizOpp`:
                    console.log("input Field Data: ", data);
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
                                                {(Object.keys(data).length > 0 ? 
                                                    (
                                                        data.search_commonness_pro.map((e) => {
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
                                                {(Object.keys(data).length > 0 ? 
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
                                            {(Object.keys(data).length > 0 ? 
                                            (
                                                depts.map((dept) => (
                                                <option key={dept.dept_id} value={dept.dept_id}>
                                                    {dept.dept_name}
                                                </option>
                                                ))
                                            )
                                            :
                                            ('')
                                            )}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className="col d-flex align-items-center justify-content-start">
                                        <Form.Label className="">팀</Form.Label>
                                        <Form.Select id='select2' size='sm'  /* value={option2} onChange={handleSelect2Change} aria-label='selectBox' disabled={options.length === 0}   */disabled={!selectTeam.length}>
                                            <option value="">-- 팀을 선택하세요 --</option>
                                            {selectTeam.map((team) => (
                                                <option key={team.dept_id} value={team.dept_id}>
                                                    {team.dept_name}
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
                /* case `activity`:
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
    }, [/* currentPath,  */data, depts, selectTeam, selectFromPro, selectToPro]);

    return (
        <div id='search' className='wrap'>
            {v_handlingHtml}
        </div>
    );
};

export default InputField;
