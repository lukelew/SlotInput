/*
 * Author  Luke.Lu
 * Date  2023-02-17 16:32:44
 * LastEditors  Luke.Lu
 * LastEditTime  2023-03-07 23:46:44
 * Description
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConfigProvider } from 'antd';
import '@/assets/styles/initial.less';
import BasicLayout from './Components/BasicLayout';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <BasicLayout>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#32b6b1'
          }
        }}
      >
        <App />
      </ConfigProvider>
    </BasicLayout>
  </BrowserRouter>
);
