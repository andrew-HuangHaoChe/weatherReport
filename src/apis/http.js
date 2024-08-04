import axios from 'axios';
const $http = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// 攔截請求
$http.interceptors.request.use(config => {
    const apikey = import.meta.env.VITE_API_KEY;
    if (config.params) {
        config.params.Authorization = apikey;
    } else {
        config.params = { Authorization: apikey };
    }
    // 登入成功後從 Local Storage 取得 token
    // const token = localStorage.getItem('token')
    // config.headers.Authorization = `Bearer ${token}`
    return config
  }, error => {
    return Promise.reject(error)
  })
  
// 攔截回應
$http.interceptors.response.use(res => {
switch (res.status) {
    case 200:
    return Promise.resolve(res)
    default:
    console.log(res.status)
}
}, error => {
if (error && error.response) {
    switch (error.response.status) {
    case 400:
        console.error(error.response)
        break
    case 401:
        console.error(error)
        break
    default:
        console.error('攔截錯誤請求', error.response.status)
        return Promise.reject(error)
    }
}
})

export default $http