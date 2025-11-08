// import axios from 'axios';

// const API_BASE_URL = 'http://10.199.194.196:5000';
// const API_BASE_URL = 'http://10.1.66.219:5000';
// const API_BASE_URL = 'http://127.0.0.1:5000';

// // 通用方法 
// export function fetchList(params, apiEndpoint) {
//   return axios.get(`${API_BASE_URL}${apiEndpoint}`, { params });
// }
// export function fetchFollowedList(searchParams, apiEndpoint) {
//   return axios.get(`${API_BASE_URL}${apiEndpoint}?${searchParams.toString()}`);
// }
// export function date(apiEndpoint) {
//   return axios.get(`${API_BASE_URL}${apiEndpoint}`);
// }


// 模拟 API 方法
export function fetchList(params, apiEndpoint) {
  console.log('📡 模拟API调用 - fetchList:', apiEndpoint, params);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // 返回空数据，避免报错
      resolve({
        data: {
          data: [],
          totalItemNum: 0
        }
      });
    }, 300);
  });
}

export function fetchFollowedList(searchParams, apiEndpoint) {
  console.log('📡 模拟API调用 - fetchFollowedList:', apiEndpoint);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          data: [],
          totalItemNum: 0
        }
      });
    }, 300);
  });
}

export function date(apiEndpoint) {
  console.log('📡 模拟API调用 - date:', apiEndpoint);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          date: new Date().toLocaleDateString('zh-CN')
        }
      });
    }, 200);
  });
}