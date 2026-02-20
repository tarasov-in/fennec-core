import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import App from './App';
import { DemoProviders } from './DemoProviders';
// Ant Design 5 использует CSS-in-JS, отдельный импорт стилей не нужен

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={ruRU}>
      <DemoProviders>
        <App />
      </DemoProviders>
    </ConfigProvider>
  </React.StrictMode>
);
