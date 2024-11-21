import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// 컴포넌트 불러오기 (export 방식에 맞추어 확인 필요)
import Home from './Home';       // default export인 경우
import AuthLogin from '../Login';         // default export인 경우
import Data from '../../utils/Table';
const components = {
  Home: () => <Home />,
  AuthLogin: () => <AuthLogin />,
  Data: () => <Data />,
  Settings: () => <div>Settings Content</div>,
};

const MultiTabComponent = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const openTab = (name) => {
    if (!components[name]) {
      console.warn(`Component '${name}' is not defined in components object.`);
      return;
    }
    const existingTab = tabs.find((tab) => tab.name === name);
    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      const newTab = { id: uuidv4(), name, Component: components[name] };
      setTabs((prevTabs) => [...prevTabs, newTab]);
      setActiveTab(newTab.id);
    }
  };

  const closeTab = (id) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    if (activeTab === id && tabs.length > 1) {
      const newActiveTab = tabs.filter((tab) => tab.id !== id)[0];
      setActiveTab(newActiveTab.id);
    } else if (tabs.length <= 1) {
      setActiveTab(null);
    }
  };

  return (
    <div id='tab'>
      <div className='btnArea'>
        <button onClick={() => openTab('Home')}>Home</button>
        {/* <button onClick={() => openTab('AuthLogin')}>AuthLogin</button> */}
        <button onClick={() => openTab('Settings')}>Settings</button>
        <button onClick={() => openTab('Data')}>Data</button>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#ddd' : '#f5f5f5',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
            <button onClick={() => closeTab(tab.id)} style={{ marginLeft: '5px' }}>x</button>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div key={tab.id}>
                <tab.Component />
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default MultiTabComponent;
