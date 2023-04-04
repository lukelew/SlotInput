/*
 * Author  Luke.Lu
 * Date  2022-06-28 09:59:44
 * LastEditors  Luke.Lu
 * LastEditTime  2023-03-16 13:44:44
 * Description 各方法返回值暂时设为any，为了各具体调用方法可以设置不同数据类型。可能不顾完善。
 */
import axiosRequest from './common';

const post = (url, data, options) => {
  return axiosRequest('post', url, data, options);
};

const get = (url) => {
  return axiosRequest('get', url);
};

const put = (url, data) => {
  return axiosRequest('put', url, data);
};

const del = (url) => {
  return axiosRequest('delete', url);
};

export default { post, get, put, del };
