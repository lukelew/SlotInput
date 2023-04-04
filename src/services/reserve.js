/*
 * Author  Luke.Lu
 * Date  2023-03-16 13:46:27
 * LastEditors  Luke.Lu
 * LastEditTime  2023-03-16 14:16:29
 * Description
 */
import request from '@/utils/request';

export const addNewReserve = (params) => {
  return request.post('/api/v1/washiWebsite/contactInfo', params);
};
