import { login } from '../';
import { Button, ButtonGroup, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Columns, Person } from 'react-bootstrap-icons';
import SearchField from './SearchField';
import MyTable from '../utils/Table.js';
import myData from '../utils/datas/test.json';
import Api from '../utils/api.js';
const BizOpp = () => {
    console.log(myData[0][0].매출);
    return (
        <>
            <h2>사업 (기회) 조회</h2>
            <SearchField/>
            <div className='wrap'>
                <MyTable />
                <Api />
            </div>
        </>
    )


}
export default BizOpp;