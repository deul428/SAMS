import Table from '../utils/Table';
import SearchField from './SearchField';
import { useSelector } from 'react-redux';
const Activity = () => {
    const currentPath = useSelector((state) => state.location.currentPath);
    console.log("currentpath====================\n", currentPath);
    return (
        <>
            <SearchField />
            <div className="wrap">
                <Table/>
            </div>
        </>
    )
}

export default Activity;