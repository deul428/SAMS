// DOM 렌더링 관리, React와 브라우저의 DOM 연결
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
