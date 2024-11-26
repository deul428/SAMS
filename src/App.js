import { useLocation, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import roots from './utils/datas/Roots';
import Header from './components/Header';
import MultiTabComponent from './components/test/Tab';

import './App.scss';
import AuthLogin from './components/Login';
import Auth from './utils/Auth';
import ExcelTable from './components/test/ExcelTable';
import Tree_uiUsed_productManage from './components/test/Tree_uiUsed_productManage';
function AppCntnt() {
  const location = useLocation();
  // const hiddenPaths = roots.map(route => `/${route.depth1[0]}`);
  const hiddenPaths = `/login`;
  // console.log(hiddenPaths);
  return (
    <>
      {!hiddenPaths.includes(location.pathname) && <Header />}
      <div id='cntntArea'>
        {!hiddenPaths.includes(location.pathname) && <MultiTabComponent />}
        {/* <ExcelTable></ExcelTable> */}
        {/* <Tree_uiUsed_productManage></Tree_uiUsed_productManage> */}
        <Routes>
          <Route exact path='/' element={<AuthLogin />} />
          { roots.map((value, index) => (
            <Route 
              key={index} 
              path={`/${value.depth1}/${value.depth2}`} 
              element={<value.component />}
            />
          ))}
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppCntnt />
      </Router>
    </Provider>
  );
}

export default App;