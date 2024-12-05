import Table from '../utils/DynamicTable';
import InputField from '../utils/InputField';
import { useSelector } from 'react-redux';
const Activity = () => {
    const currentPath = useSelector((state) => state.location.currentPath);
    console.log('currentpath====================\n', currentPath);
    return (
        <>
            <h2>영업 활동 관리</h2>
            <InputField />
            <div className='wrap'>
                <Table/>
            </div>
        </>
    )
}

export default Activity;