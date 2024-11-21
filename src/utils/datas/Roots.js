import Home from '../../components/test/Home';
import AuthLogin from '../../components/Login';
import BizOpp from '../../components/BizOpp';

const roots = [
    {depth1: 'login', depth2: '', component: AuthLogin},
    {depth1: 'admin', depth2: 'user', component: Home},
    {depth1: 'admin', depth2: 'code', component: Home},
    {depth1: 'admin', depth2: 'product', component: Home},
    {depth1: 'biz-opp', depth2: '', component: BizOpp},
    {depth1: 'activity', depth2: '', component: Home},
    {depth1: 'aim', depth2: 'manage', component: Home},
    {depth1: 'aim', depth2: 'achievement', component: Home}
]
export default roots;