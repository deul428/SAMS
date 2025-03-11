import { useEffect } from 'react';import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { setLocation } from './redux/reducers/LocationSlice';

import store from './redux/store';
import roots from './utils/datas/Roots';
import Header from './components/Header';
import MultiTabComponent from './components/test/Tab';

import './App.scss';
import AuthLogin from './components/Login';
import Auth from './utils/Auth';
import ExcelTable from './components/test/ExcelTable';
import Tree_uiUsed_productManage from './components/test/Tree_uiUsed_productManage';
import ResizableTable from './components/test/ResizableTable';

import usePreventRefresh from './hooks/usePreventRefresh';

function AppCntnt() {
  usePreventRefresh();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLocation(location.pathname));
  }, [location, dispatch]);
  
  const hiddenPaths = `/login`;
  return (
    <>
      {!hiddenPaths.includes(location.pathname) && <Header />}
      <div id='cntntArea'>
          {/* {!hiddenPaths.includes(location.pathname) && <MultiTabComponent />} */}
          {/* <ExcelTable></ExcelTable> */}
          {/* <Tree_uiUsed_productManage></Tree_uiUsed_productManage> */}
        <Routes>
          <Route exact path='/' element={<AuthLogin />} />
          {Object.entries(roots).map(([key, value]) => (
            <Route
              key={key}
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