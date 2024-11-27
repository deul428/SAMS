import Table from '../utils/Table';
import SearchField from './SearchField';

const Activity = () => {
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