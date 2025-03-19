import { useState } from "react";
import { auth } from "../redux/reducers/AuthSlice";
import { useSelector } from "react-redux";

const authCheck = ({ data, 
    setVDepts, setVTeams, setVSelectTeam, 
    setVDeptHandling, setVTeamHandling, setVUserhandling, v_userHandling, v_teamHandling,  
    setInput, input, 
    f_teamLinkedDept, 
    f_submitData, endpoint}) => {
    // 권한별 UI 
    // Level 1. 권한(AUT) Check 0001admin / 0002guest / 0003none
    const f_authLevel1 = () => {
        // console.log(`auth.userAuthCode: ${auth.userAuthCode} \nauth.userResCode: ${auth.userResCode} \nauth.userDeptCode: ${auth.userDeptCode}`);
        
        switch(auth.userAuthCode) {
            //1. admin
            case '0001' :
                setVDepts(data.search_headquarters);
                setVTeams(data.search_team);
                setVDeptHandling((prevDept) => ({
                    ...prevDept,
                    detpDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
            
                f_teamLinkedDept();
                // O
                break;
            // 2. guest
            case '0002' :
                setVDepts(data.search_headquarters);
                setVTeams(data.search_team);
                setVDeptHandling((prevDept) => ({
                    ...prevDept,
                    detpDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
            
                f_teamLinkedDept(); 
                break;
            // 3. none
            case '0003' :
                f_authLevel2();
                break;
            default :
                alert('권한이 없습니다. 다시 로그인해 주세요.');
                break;
        }
    }

    // Level 2. 직책(RES) Check 0001팀원 0002팀장 0003본부장
    const f_authLevel2 = () => {
        const resCode = auth.userResCode;
        switch(resCode) {
            case '0001' :
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userValue: auth.userName,
                }));
                setInput((prevInput) => ({
                    ...prevInput,
                    a_user_name: v_userHandling.userValue.trim(),
                }))
                // f_authLevel3('팀원');
                break;
            case '0002' :
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                // f_authLevel3('팀장');
                break;
            case '0003' :
                setVUserhandling((prevDept) => ({
                    ...prevDept,
                    userDisabled: false,
                }));
                setVTeamHandling((prevDept) => ({
                    ...prevDept,
                    teamDisabled: false,
                }));
                break;
            default :
                break;
        }
        
        f_authLevel3(resCode);
    }
    
    // Level 3. 부서(dept 테이블의 change_preparation_dept_id)
    /* 9201	경영관리팀
    9509	운영팀
    9711	영업1팀
    9712	영업2팀
    9713	영업3팀
    9721	전략사업1팀
    9722	전략사업2팀
    9723	전략사업3팀
    9801	신사업추진팀 */
    const f_authLevel3 = (resCode) => {
        let dept, team;
        const deptId = auth.userDeptCode;
        if (deptId.length === 4) {
            switch(deptId) {
                case '9201' :
                    dept = [data.search_headquarters[1]];
                    team = [data.search_team[0]];
                    break;
                case '9509' :
                    dept = [data.search_headquarters[2]];
                    team = [data.search_team[1]];
                    break;
                case '9711' :
                    dept = [data.search_headquarters[3]];
                    team = [data.search_team[2]];
                    break;
                case '9712' :
                    dept = [data.search_headquarters[3]];
                    team = [data.search_team[3]];
                    break;
                case '9713' :
                    dept = [data.search_headquarters[3]];
                    team = [data.search_team[4]];
                    break;
                case '9721' :
                    dept = [data.search_headquarters[4]];
                    team = [data.search_team[5]];
                    break;
                case '9722' :
                    dept = [data.search_headquarters[4]];
                    team = [data.search_team[6]];
                    break;
                case '9723' :
                    dept = [data.search_headquarters[4]];
                    team = [data.search_team[7]];
                    break;
                case '9801' :
                    dept = [data.search_headquarters[5]];
                    team = [data.search_team[8]];
                    break;
                default :
                    break;
            }
        } else if (deptId.length === 5) {
            switch(deptId) {
                case '91000' :
                    dept = [data.search_headquarters[0]];
                    team = '';
                    break;
                case '92000' :
                    dept = [data.search_headquarters[1]];
                    team = [data.search_team[0]];
                    break;
                case '95000' :
                    dept = [data.search_headquarters[2]];
                    team = [data.search_team[1]];
                    break;
                case '97100' :
                    dept = [data.search_headquarters[3]];
                    team = '';
                    break;
                case '97200' :
                    dept = [data.search_headquarters[4]];
                    team = '';
                    break;
                case '98000' :
                    dept = [data.search_headquarters[5]];
                    team = [data.search_team[8]];
                    break;
                default :
                    break;
            } 
        } else {
            dept = '';
            team = '';
            console.log('no dept, no team');
        }
        console.log(dept, team);

        let checkDeptId = deptId.substr(0, 3);
        switch (checkDeptId) {
            case '971' :
                setVSelectTeam([data.search_team[2], data.search_team[3], data.search_team[4]]);
                break;
            case '972' :
                setVSelectTeam([data.search_team[5], data.search_team[6], data.search_team[7]]);
                break;
            default : 
                break;
        }
        f_teamLinkedDept(); 
        if (resCode === '0002') {
            setVTeamHandling({
                teamValue: team[0].change_preparation_dept_id,
                teamMsg: team[0].change_preparation_dept_name,
                teamDisabled: true
            })
            setVDeptHandling({
                deptValue: dept[0].change_preparation_dept_id,
                deptMsg: dept[0].change_preparation_dept_name,
                detpDisabled: true,
            });
        } else if (resCode === '0003') {
            if (v_teamHandling.teamValue) {
                setVTeamHandling({
                    teamValue: team[0].change_preparation_dept_id,
                    teamMsg: team[0].change_preparation_dept_name,
                })
            } else {
                setVTeamHandling((team) => ({
                    ...team,
                    teamValue: dept[0].change_preparation_dept_id,
                    // teamMsg: dept[0].change_preparation_dept_name,
                }))
            }
            setVDeptHandling({
                deptValue: dept[0].change_preparation_dept_id,
                deptMsg: dept[0].change_preparation_dept_name,
                detpDisabled: true,
            });
        } else {
            setVTeamHandling({
                teamValue: team[0].change_preparation_dept_id,
                teamMsg: team[0].change_preparation_dept_name,
                teamDisabled: true
            })
            setVDeptHandling({
                deptValue: dept[0].change_preparation_dept_id,
                deptMsg: dept[0].change_preparation_dept_name,
                detpDisabled: true,
            });
        }

        // 팀 다른 거 선택했다가 기본값으로 바꿀 시 본부 데이터로 교체해야 되는데 벗겨져 버림

        let updatedInput = {};
        if (team) {
            updatedInput = {
                ...input,
                a_headquarters_dept_id: team[0].change_preparation_high_dept_id,
                a_change_preparation_dept_id: team[0].change_preparation_dept_id,
            };
        } else {
            console.log('no team');
            updatedInput = {
                ...input,
                // a_headquarters_dept_id: dept[0].change_preparation_high_dept_id,
                a_change_preparation_dept_id: dept[0].change_preparation_dept_id,
            };
        }

        setInput(updatedInput);
        f_submitData('post', endpoint, updatedInput);
        
        // setInput((prevInput) => ({
        //     ...prevInput,
        //     a_headquarters_dept_id: team[0].change_preparation_high_dept_id, 
        //     a_change_preparation_dept_id: team[0].change_preparation_dept_id,
        //     // a_user_name: v_userHandling.userValue
        // }));
        
    }

    f_authLevel1();
}