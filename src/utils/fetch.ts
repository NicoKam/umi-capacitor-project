import { extend, ResponseError, RequestOptionsInit } from 'umi-request';

/* 异常处理 */
const errorHandler = function(error: ResponseError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(error.response.status, error.request);
  } else {
    // The request was made but no response was received or error occurs when setting up the request.
    console.error('Request error:', error.message);
  }
  throw error;
};

const request = extend({
  // 为每个请求添加前缀
  prefix: '/api',
  errorHandler,
});

/* 处理data */
const handleResponseData = (data: any) => {
  return data;
};

const get = (url: string, params: object | URLSearchParams, options: RequestOptionsInit) =>
  request
    .get(url, { ...options, params })
    .then(handleResponseData);

const post = (url: string, data: any, options: RequestOptionsInit) =>
  request
    .post(url, { ...options, data })
    .then(handleResponseData);

const put = (url: string, data: any, options: RequestOptionsInit) =>
  request
    .put(url, { ...options, data })
    .then(handleResponseData);

const del = (url: string, data: any, options: RequestOptionsInit) =>
  request
    .delete(url, { ...options, data })
    .then(handleResponseData);

/**
 * // How to upload file?
 * const formData = new FormData();
 * formData.append('file', file);
 * request.post('/api/v1/some/api', { data: formData });
 */

// 导出你所需要使用的方法
export { request, get, post, put, del };
