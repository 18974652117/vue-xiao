import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1'
})

/** 添加请求拦截器  设置请求头 */
instance.interceptors.request.use(function (config) {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

export default instance
