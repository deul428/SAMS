import Home from '../../components/test/Home';
import AuthLogin from '../../components/Login';
import BizOpp from '../../components/BizOpp';
import Activity from '../../components/Activity';
import { Button } from 'react-bootstrap';


const roots = [
    {depth1: 'login', depth2: '', component: AuthLogin},
    {depth1: 'admin', depth2: 'user', component: Home},
    {depth1: 'admin', depth2: 'code', component: Home},
    {depth1: 'admin', depth2: 'product', component: Home},
    {depth1: 'biz-opp', depth2: '', component: BizOpp, 
    props: [
        { Header: '사업 일련 번호', accessor: 'biz_opp_id' },
        { Header: '부서명', accessor: 'change_preparation_dept_name' },
        { Header: '사용자 이름', accessor: 'user_name' },
        { Header: '판품 번호', accessor: 'sale_item_no' },
        { Header: '사업 (기회)명', accessor: 'biz_opp_name' },
        { Header: '최종 고객사1 이름', accessor: 'last_client_com1_name' },
        { Header: '최종 고객사2 이름', accessor: 'last_client_com2_name' },
        { Header: '매출처1 이름', accessor: 'sale_com1_name' },
        { Header: '매출처2 이름', accessor: 'sale_com2_name' },
        { Header: '진행률1 code', accessor: 'progress1_rate' },
        { Header: '진행률2 code', accessor: 'progress2_rate' },
        { Header: '필달 여부', accessor: 'essential_achievement_tf', Cell: ({value}) => v_handlingTF(value) },
        { Header: '계약 일자', accessor: 'contract_date',
        Cell: ({value}) => v_handlingDate(value) },
        { Header: '매출 일자', accessor: 'sale_date',
        Cell: ({value}) => v_handlingDate(value) },
        { Header: '매입 일자', accessor: 'purchase_date',
        Cell: ({value}) => v_handlingDate(value) },
        { Header: '매출 금액', accessor: 'sale_amt', 
        Cell: ({value}) => v_handlingNum(value) },
        { Header: '매입 금액', accessor: 'purchase_amt', 
        Cell: ({value}) => v_handlingNum(value) },
        { Header: '매출 이익', accessor: 'sale_profit', 
        Cell: ({value}) => v_handlingNum(value) },
        { Header: '사업 구분1 code', accessor: 'biz_section1_code' },
        { Header: '사업 구분2 code', accessor: 'biz_section2_code' },
        { Header: '제품1 이름', accessor: 'product1_name' },
        { Header: '제품2 이름', accessor: 'product2_name' },
        { Header: '활동 이력', accessor: 'history'},
        // { Header: '사용자 ID', accessor: 'user_id' },
        // { Header: '부서 ID', accessor: 'change_preparation_dept_id' },
        // { Header: '최종 고객사1 code', accessor: 'last_client_com1_code' },
        // { Header: '최종 고객사2 code', accessor: 'last_client_com2_code' },
        // { Header: '매출처1 code', accessor: 'sale_com1_code' },
        // { Header: '매출처2 code', accessor: 'sale_com2_code' },
        // { Header: '등록자 ID', accessor: 'create_user' },
        // { Header: '등록 일시', accessor: 'create_date' },
        // { Header: '수정자 ID', accessor: 'update_user' },
        // { Header: '수정 일시', accessor: 'update_date' },
        // { Header: '삭제자 ID', accessor: 'delete_user' },
        // { Header: '삭제 일시', accessor: 'delete_date' },
        ]
    },
    {depth1: 'activity', depth2: '', component: Activity},
    {depth1: 'aim', depth2: 'manage', component: Home},
    {depth1: 'aim', depth2: 'achievement', component: Home}
] 
function v_handlingTF(value) { return value ? 'Y' : 'N'; }
function v_handlingDate(value) {
    if (value) { const v_formatValue = value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'); return v_formatValue; }
    return value;
}
function v_handlingNum(value) {
    console.log(value);
    if (value || value === 0) { 
        const v_formatValue = value.toLocaleString('ko-KR'); return v_formatValue; 
    }
    return value;
};
export default roots;