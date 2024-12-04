import Home from '../../components/Home';
import AuthLogin from '../../components/Login';
import BizOpp from '../../components/BizOpp';
import Activity from '../../components/Activity';
import { Button } from 'react-bootstrap';


const roots = [
    {depth1: 'login', depth2: '', component: AuthLogin},
    {depth1: 'admin', depth2: 'user', component: Home},
    {depth1: 'admin', depth2: 'code', component: Home},
    {depth1: 'admin', depth2: 'product', component: Home},
    {depth1: 'biz-opp', depth2: '', url: 'select-biz-opp1/', component: BizOpp, 
    props: [
        { Header: '사업 일련 번호', accessor: 'biz_opp_id' },
        { Header: '본부', accessor: 'high_dept_name' },
        { Header: '팀', accessor: 'change_preparation_dept_name' },
        { Header: '영업 담당자', accessor: 'user_name' },
        { Header: '판품 번호', accessor: 'sale_item_no' },
        { Header: '사업 (기회) 명', accessor: 'biz_opp_name' },
        { Header: '최종 고객사', accessor: 'last_client_com2_name' },
        { Header: '매출처', accessor: 'sale_com2_name' },
        
        
        
        // { Header: '진행률 대분류', accessor: 'progress1_rate_name' },
        { Header: '진행률', accessor: 'progress2_rate_name' },
        
        
        
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
        { Header: '사업 구분', accessor: 'biz_section2_name' },
        { Header: '주요 제품', accessor: 'principal_product2_name' },
        { Header: '활동 이력', accessor: 'history'},
    ]
    },
    {depth1: 'activity', depth2: '', component: Activity},
    {depth1: 'aim', depth2: 'manage', component: Home},
    {depth1: 'aim', depth2: 'achievement', component: Home},
    {depth1: 'home', depth2: '', url: 'home/', component: Home}, 
] 
function v_handlingTF(value) { return value ? 'Y' : 'N'; }
function v_handlingDate(value) {
    if (value) { const v_formatValue = value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'); return v_formatValue; }
    return value;
}
function v_handlingNum(value) {
    if (value || value === 0) { 
        const v_formatValue = value.toLocaleString('ko-KR'); return v_formatValue; 
    }
    return value;
};
export default roots;