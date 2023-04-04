/*
 * Author  Luke.Lu
 * Date  2022-06-28 10:02:05
 * LastEditors  Luke.Lu
 * LastEditTime  2023-03-16 14:33:16
 * Description
 */
import axios from 'axios';
import { message } from 'antd';

const basicOptions = {
  timeout: 5000,
  headers: {
    'content-type': 'application/json'
  }
};

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        message.error(response.data.message);
        throw { code: response.data.code, message: response.data.message, requestSource: response.request.responseURL };
      }
    }
  },
  (error) => {
    console.log('error :>> ', error);
  }
);

const axiosRequest = (method, url, data, options) => {
  return axiosInstance.request({ ...basicOptions, ...options, method: method, url, data }).then((res) => {
    return res;
  });
};

export default axiosRequest;
