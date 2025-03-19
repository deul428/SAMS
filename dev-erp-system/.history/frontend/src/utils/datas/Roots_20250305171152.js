import moment from 'moment';
import Home from '../../components/Home';
import AuthLogin from '../../components/Login';
import BizOpp from '../../components/BizOpp';
import Activity from '../../components/Activity';
import BizOppHistory from '../../components/BizOppHistory';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const auth = (function getAuth() {
  const state = JSON.parse(localStorage.getItem('persist:root')); // Redux의 `persisted state`에서 auth 가져오기
  return state ? JSON.parse(state.auth) : {};
})();
const roots = {
  login: {depth1: 'login', depth2: '', component: AuthLogin, endpoint: 'login/'},
    adminUser: {depth1: 'admin', depth2: 'user', component: Home},
    adminCode: {depth1: 'admin', depth2: 'code', component: Home},
    adminProduct: {depth1: 'admin', depth2: 'product', component: Home},
    bizoppSelect1: {depth1: 'biz-opp', depth2: '', endpoint: 'select-biz-opp1/', component: BizOpp, 
      props: [
        { Header: '행 번호', accessor: 'no', },
        { Header: '사업 일련 번호', accessor: 'biz_opp_id' },
        { Header: '사업 복제 번호', accessor: 'detail_no'},
        { Header: '본부', accessor: 'change_preparation_high_dept_name' },
        { Header: '팀', accessor: 'change_preparation_dept_name' },
        { Header: '담당자', accessor: 'user_name' },
        { Header: '판품 번호', accessor: 'sale_item_no' },
        { Header: '사업 (기회) 명', accessor: 'biz_opp_name' },
        { Header: '최종 고객사', accessor: 'last_client_com2_name' },
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
        { Header: '대표 사업 구분', accessor: 'delegate_biz_section_name' },
        { Header: '대표 제조사명', accessor: 'delegate_sale_com_name' },
        { Header: '활동 이력', accessor: 'bizopp_history'}, 
        { Header: '사업 복제', accessor: 'bizopp_copy'},
      ]
    },
    bizoppSelect2: {depth1: 'biz-opp', depth2: '', endpoint: 'select-biz-opp2/', component: BizOpp, 
    },
    bizoppHistory: {depth1: 'biz-opp-history', depth2: '', endpoint: 'select-biz-opp-history/', component: BizOppHistory,
    props: [
      { Header: '이력 번호', accessor: 'history_no' },
      { Header: '갱신 일시', accessor: 'renewal_date', Cell: ({value}) => value ? moment(value).format('YYYY-MM-DD') : '' },
      { Header: '갱신 구분', accessor: 'renewal_code', Cell: ({value}) => value === 'I'? value = '등록' : value === 'U'? value = '수정' : value === 'D'? value = '삭제' : value === 'C'? value = '등록(복제)' : '' },
      { Header: '담당자', accessor: 'user_name' },
      { Header: '판품 번호', accessor: 'sale_item_no',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'sale_item_no')} className='tableCell'>
            {value}
          </div>
          ),  
        },
      { Header: '사업 (기회) 명', accessor: 'biz_opp_name', 
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'biz_opp_name')} className='tableCell'>
            {value}
          </div>
        ),
      },
      { Header: '최종 고객사', accessor: 'last_client_com2_name',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'last_client_com2_code')} className='tableCell'>
            {value}
          </div>
          ),  
      },
      { Header: '매출처', accessor: 'delegate_sale_com_name', 
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'sale_com2_code')} className='tableCell'>
            {value}
          </div>
          ),  
      },
      { Header: '진행률', accessor: 'progress2_rate_name',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'progress2_rate_code')} className='tableCell'>
            {value}
          </div>
          ),  
        },
      { Header: '필달 여부', accessor: 'essential_achievement_tf', 
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'essential_achievement_tf')} className='tableCell'>
            {applyFunctions(value, v_handlingTF)}
          </div>
          ),  
      },
      { Header: '수금 일자', accessor: 'collect_money_date',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'collect_money_date')} className='tableCell'>
            {applyFunctions(value, v_handlingDate)}
          </div>
          ),  
      },
      { Header: '계약 일자', accessor: 'contract_date',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'contract_date')} className='tableCell'>
            {applyFunctions(value, v_handlingDate)}
          </div>
          ),  
      },
      { Header: '매출 일자', accessor: 'sale_date',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'sale_date')} className='tableCell'>
            {applyFunctions(value, v_handlingDate)}
          </div>
          ),  
      },
      { Header: '매입 일자', accessor: 'purchase_date',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'purchase_date')} className='tableCell'>
            {applyFunctions(value, v_handlingDate)}
          </div>
          ),  
      },
      { Header: '매출 금액', accessor: 'total_sale_amt', 
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'total_sale_amt')} className='tableCell'>
            {applyFunctions(value, v_handlingNum)}
          </div>
          ),  
      },
      { Header: '매입 금액', accessor: 'purchase_amt', 
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'purchase_amt')} className='tableCell'>
            {applyFunctions(value, v_handlingNum)}
          </div>
          ),  
      },
      { Header: '매출 이익', accessor: 'sale_profit', 
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'sale_profit')} className='tableCell'>
            {applyFunctions(value, v_handlingNum)}
          </div>
          ),  
      },
      /* { Header: '사업 구분', accessor: 'delegate_biz_section_name',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'biz_section2_code')} className='tableCell'>
            {value}
          </div>
        ),
      },
      { Header: '제품 구분', accessor: 'principal_product2_name',
      Cell: ({ value, row }) => (
          <div style={dynamicCellStyle(row, 'principal_product2_code')} className='tableCell'>
            {value}
          </div>
        ),
      }, */
      // { Header: '활동 일자', accessor: 'activity_date'},
      // { Header: '활동 이력', accessor: 'activity_details'},
    ]
    },
    activitySelect1: {depth1: 'activity', depth2: '', endpoint: 'select-biz-opp-activity1/', component: Activity,
        props: [
            { Header: '본부', accessor: 'change_preparation_high_dept_name' },
            { Header: '팀', accessor: 'change_preparation_dept_name' },
            { Header: '담당자', accessor: 'user_name' },
  
            { Header: '사업 일련 번호', accessor: 'biz_opp_id'},
            { Header: '사업 (기회) 명', accessor: 'biz_opp_name' },
            { Header: '계약 일자', accessor: 'contract_date',
            Cell: ({value}) => v_handlingDate(value) },
            { Header: '매출 일자', accessor: 'sale_date',
            Cell: ({value}) => v_handlingDate(value) },
            { Header: '매출 금액', accessor: 'sale_amt', 
            Cell: ({value}) => v_handlingNum(value) },
            { Header: '매출 이익', accessor: 'sale_profit', 
            Cell: ({value}) => v_handlingNum(value) },
            /* { Header: '대표 사업 구분', accessor: 'delegate_biz_section_name' },
            { Header: '제품 구분', accessor: 'principal_product2_name' }, */
  
            { Header: '업데이트 일자', accessor: 'activity_date', 
            Cell: ({value}) => v_handlingNum(value) },
            { Header: '활동 내역', accessor: 'activity_details'},
        ]
    },
    activitySelect2: {depth1: 'activity', depth2: '', endpoint: 'select-biz-opp-activity2/', component: Activity, 
    },
    aimManage: {depth1: 'aim', depth2: 'manage', component: Home},
    aimacheive: {depth1: 'aim', depth2: 'achievement', component: Home},
    home: {depth1: 'home', depth2: '', url: 'home/', component: Home}, 
}



function applyFunctions(value, ...functions) {
  return functions.reduce((acc, func) => func(acc), value);
}
  
function v_handlingTF(value) { return value ? 'Y' : 'N'; }
function v_handlingDate(value) {
  if (value) { const v_formatValue = value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'); return v_formatValue; }
  return value;
}
function v_handlingNum(value) {
  if (value || value === 0) { const v_formatValue = value.toLocaleString('ko-KR'); return v_formatValue; }
  return value;
};
/* function v_handlingCss({value, row}) {
    <div className='tableCell' style={{backgroundColor: value && row ? 'rgba(255,0,0,0.4)' : 'white', height: 'inherit'}}>
    {value}
</div>
} */
function dynamicCellStyle(row, parameter) {
  const isChanged = row.original[`u_${parameter}`]; 
  return { backgroundColor: isChanged ? 'rgba(255,0,0,0.4)' : 'white', };
}
  
export default roots;