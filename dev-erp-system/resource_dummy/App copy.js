import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import Login from './components/Login';
import Home from './components/test';

import { Button } from 'react-bootstrap';
import './App.scss';
// const [testData, setTestData] = useState([]);

  // useEffect(() => {
  //   fetch('http://localhost:8000/api/test-data/')
  //     .then((response) => response.json())
  //     .then((data) => setTestData(data))
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // Router: 전체 페이지 이동 시스템을 관리.
  // Routes: 여러 페이지 간의 경로를 묶어서 관리.
  // Route: 각 URL에 맞는 페이지(컴포넌트)를 설정.
function App() {
  return (
    <Router> 
      <nav>
        <Link to="/">Home</Link> {/* 이걸 클릭하면 Home 페이지로 이동 */}
      </nav>
      <Routes>
        <Route exact path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
// <div>
    //   <ul>
    //     {testData.map((item) => (
    //       <li key={item.id}>
    //         <h2>{item.name}</h2>
    //         <p>{item.description}</p>
    //       </li>
    //     ))}
    //     {console.log(testData)}
    //   </ul>
    //   <Login />
    // </div>