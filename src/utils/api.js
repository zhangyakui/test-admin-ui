import http from './http.js'

export default {
    // 登录接口 POST
    async login(account, password){
        let body = new URLSearchParams()
        body.append('account', account)
        body.append('password', password)
        return await http.post('/login', body)
    },
    // 获取 菜单列表 权限列表 GET
    async getMenuList(){
        return await http.get('/permission')
    }
}

