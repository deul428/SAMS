import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';

const InputFieldDetail = ({ show, onHide, v_modalPropsData }) => {
    const initialState = {
        biz_opp_id: '',
        biz_opp_name: '',
        last_client_com2_name: '',
        high_dept_name: '',
        dept_name: '',
        user_name: '',
        essential_achievement_tf: false,
    };

    const [input, setInput] = useState(initialState);
    const inputRefs = useRef({}); // DOM 참조를 위한 useRef

    // 부모 데이터로 상태 초기화
    useEffect(() => {
        if (v_modalPropsData) {
            setInput(v_modalPropsData);
            // inputRefs에 초기 데이터 세팅
            Object.keys(v_modalPropsData).forEach((key) => {
                if (inputRefs.current[key]) {
                    inputRefs.current[key].value = v_modalPropsData[key];
                }
            });
        }
    }, [v_modalPropsData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // 체크박스는 바로 상태 업데이트
        if (type === 'checkbox') {
            setInput((prevInput) => ({
                ...prevInput,
                [name]: checked,
            }));
        } else {
            // 입력 필드의 값을 inputRefs를 통해 직접 반영
            if (inputRefs.current[name]) {
                inputRefs.current[name].value = value;
            }
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        // Blur 시 상태에 최종 값 반영
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>Input Test</Modal.Header>
            <Modal.Body>
                <label htmlFor="biz_opp_name">사업명</label>
                <input
                    id="biz_opp_name"
                    name="biz_opp_name"
                    ref={(el) => (inputRefs.current['biz_opp_name'] = el)}
                    defaultValue={input.biz_opp_name || ''} // 초기 데이터 설정
                    onChange={handleChange}
                    onBlur={handleBlur} // Focus out 시 상태 업데이트
                    placeholder="사업명을 입력하세요"
                />
                <label htmlFor="user_name">영업 담당자</label>
                <input
                    id="user_name"
                    name="user_name"
                    ref={(el) => (inputRefs.current['user_name'] = el)}
                    defaultValue={input.user_name || ''} // 초기 데이터 설정
                    onChange={handleChange}
                    onBlur={handleBlur} // Focus out 시 상태 업데이트
                    placeholder="영업 담당자를 입력하세요"
                />
            </Modal.Body>
        </Modal>
    );
};

export default InputFieldDetail;
