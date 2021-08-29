import router from '../router/index.js';
import axios from 'axios';
import {Message} from 'element-ui';


// baseUrl
axios.defaults.baseURL = 'http://192.168.0.119:7002'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// 请求拦截
axios.interceptors.request.use(request => {

    if (request.url == '/login') return request
        
    // 判断token是否过期
    const token = JSON.parse(localStorage.getItem('token'))
    if (token){
        request.headers['Authorization'] = token
        return request
    }

    window.localStorage.removeItem('token')
    router.push('/login')
    Message.error('token不存在, 请重新登录!')
    return request

}, () => {
    Message.error('服务端请求异常!')
});

// 响应拦截
axios.interceptors.response.use(response => {
    if (response.data.code == 400){
        Message.error('参数错误!')
    }else if (response.data.code == 401){
        window.localStorage.removeItem('token')
        router.push('/login')
        Message.error('Token已过期, 请重新登录!')
    }else if (response.data.code == 403){
        Message.error('您没有权限访问, 请联系管理员!')
    }
    return response

}, () => {
    Message.error('服务端响应异常!')
});

export default axios;
