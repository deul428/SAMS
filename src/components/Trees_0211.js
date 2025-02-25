import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import '../styles/_customModal.scss';
import TreeLibrary from "./test/Tree";
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
    const [inputValues, setInputValues] = useState({}); // 입력값 저장
    const handleInputChange = (key, value) => {
        setInputValues(prev => ({
            ...prev,
            [key]: value
        }));
    };
    useEffect(() => {
        if (data) {
            bizCode = data.data.search_biz_section_code;
            corCode = data.data.search_last_client_com_code;
            priCode = data.data.search_principal_product_code;
            console.log(bizCode, corCode, priCode);

            const newTreeData = bizCode.map((e, index) => ({
                title: 
                    <>
                    <span>{e.small_classi_name}</span>
                    <input type='text' placeholder='비고' value={inputValues['0-0'] || ''} onChange={(e) => handleInputChange('0-0', e.target.value)} />
                    </>,
                key: `0-${index}`, // 키를 유니크하게 변경
                children: [
                    {
                        title: 
                        <>
                        <span>{index}</span>
                        <input type='text' placeholder='비고' value={inputValues['0-0'] || ''} onChange={(e) => handleInputChange('0-0', e.target.value)} />
                        </>,
                        key: `0-${index}-0`,
                        children: [
                            { title: 
                            <><span>test</span>
                                <input type='text' placeholder='비고' value={inputValues['0-0'] || ''} onChange={(e) => handleInputChange('0-0', e.target.value)} /></>,
                                key: `0-${index}-0-0`
                            },
                            { title: 'Level 3 - Node 1', key: `0-${index}-0-1` },
                            { title: 'Level 3 - Node 2 (isLeaf)', key: `0-${index}-0-2`, isLeaf: true },
                            { title: 'Level 3 - Node 3 (disabled)', key: `0-${index}-0-3`, disabled: true },
                        ],
                    }
                ],
            }));
        
            setTreeData(newTreeData); // 한 번만 상태 업데이트
        }
    }, [data]);

    const [selectedKeys, setSelectedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const onSelect = (selectedKeys, info) => {
        console.log('selected key', selectedKeys);
        console.log('info', info);
        console.log('selected key info', info.node.title);
        setSelectedKeys(selectedKeys);
        /* const targetNode = document.querySelector(`[title="${info.node.title}"]`);
        if (targetNode) {
            console.log("찾은 노드:", targetNode);
            let siblingDiv = targetNode.parentElement.querySelector(".custom-input-container");
            if (!siblingDiv) {
                siblingDiv = document.createElement("div");
                siblingDiv.className = "custom-input-container";
                siblingDiv.innerHTML = `<input type="text" placeholder="Enter value" class="custom-input"/>`;
                targetNode.parentElement.appendChild(siblingDiv);
            }
        } */
        
        /* // 🚀 노드를 클릭하면 체크박스도 같이 체크/해제
        const key = info.node.key;
        const newCheckedKeys = checkedKeys.includes(key)
            ? checkedKeys.filter(k => k !== key) // 이미 체크되어 있으면 제거
            : [...checkedKeys, key]; // 체크 안 되어 있으면 추가

        setCheckedKeys(newCheckedKeys); */
    }
    const onCheck = (checkedKeys, info) => {
        console.log(info)
        console.log("체크된 키:", checkedKeys);
        setCheckedKeys(checkedKeys);
    };
    
    useEffect(()=> {
        if(show) {

        } else {
            setSelectedKeys([]);
            setCheckedKeys([]);
        }
    }, [show])
    useEffect(() => {
        const updateUI = () => { 
            if (data) {
                if (v_treeName === 'product') {
                    setVHandlingHtml(
                        <Modal size='xl' show={show} onHide={onHide} id='salesDetail'>
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
                                        <Tree multiple checkStrictly treeData={treeData} /* onCheck={onSelect}  */onSelect={onSelect}/*  checkedKeys={checkedKeys} *//* onSelect={(checkedKeys, info) => onSelect((checkedKeys, info))} *//>
                                        {/* <p>selectedKeys: {selectedKeys}</p> */}
                                        <p>selectedKeys: {JSON.stringify(selectedKeys)}</p>

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
    }, [data, show, onHide, selectedKeys, checkedKeys]);
  
    return (
        <>
            {v_handlingHtml}
        </>
    )
}

export default Trees;