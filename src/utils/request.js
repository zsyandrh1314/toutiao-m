/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'




const request = axios.create({
  baseURL: 'http://toutiao.itheima.net', // 接口的基准路径
  
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 自定义后端返回的原始数据
      // 如果转换成功则返回转换的数据结果
      // data: 后端返回的原始数据，说白了就是JSON格式的字符串
      return JSONBig.parse(data)
    } catch (err) {
      // axios 默认会在内部这样来处理后端返回的数据
      // 如果转换失败，则包装为统一数据格式并返回
      return data
      // axios 默认会在内部这样来处理后端返回的数据
      // return JSON.parse(data)
    }
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config：本次请求的请求配置对象
  const { user } = store.state// 解构出来
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log(config);

  // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
  return config
}, function (error) {
  // 如果请求出错了（还没有发出去）会进入这里
  return Promise.reject(error)
})

// 响应拦截器

export default request
