import http from './http.js'

export default {
    // 登录接口 POST
    async login(account, password){
        let body = new URLSearchParams()
        body.append('account', account)
        body.append('password', password)
        return await http.post('/login', body)
    },
    // ---------------------------------------------- 菜单api ----------------------------------------------
    // 菜单列表 权限列表
    async getPermList(){
        return await http.get('/permission')
    },
    // 菜单列表
    async getMenuList(){
        return await http.get('/system/menu/list')
    },
    // 添加菜单
    async addMenu(data){
        let body = new URLSearchParams()
        body.append('pid', data.pid)
        body.append('type', data.type)
        body.append('title', data.title)
        body.append('sortId', data.sortId)
        if (data.type != 0) body.append('path', data.path)
        if (data.type == 1) body.append('cache', data.cache)
        if (data.type != 0) body.append('permission', data.permission)
        return await http.post('/system/menu/add', body)
    },
    // 修改菜单
    async editMenu(data){
        let body = new URLSearchParams()
        body.append('mid', data.mid)
        body.append('pid', data.pid)
        body.append('type', data.type)
        body.append('title', data.title)
        body.append('sortId', data.sortId)
        if (data.type != 0) body.append('path', data.path)
        if (data.type == 1) body.append('cache', data.cache)
        if (data.type != 0) body.append('permission', data.permission)
        return await http.post('/system/menu/edit', body)
    },
    // 删除菜单
    async deleteMenu(mid){
        let body = new URLSearchParams()
        body.append('mid', mid)
        return await http.post('/system/menu/delete', body)
    },
    // ---------------------------------------------- 角色api ----------------------------------------------
    // 角色列表 role/perm
    async getRoleList(type, rid=null){
        if (type == 'role'){
            return await http.get('/system/role/list', {params: {type: type}})
        }else if (type == 'perm'){
            return await http.get('/system/role/list', {params: {type: type, rid: rid}})
        }
    },
    // 添加角色
    async addRole(data){
        let body = new URLSearchParams()
        body.append('rid', data.rid)
        body.append('pid', data.pid)
        body.append('type', data.type)
        body.append('name', data.name)
        body.append('mlist', data.mlist)
        body.append('desc', data.desc)
        return await http.post('/system/role/add', body)
    },
    // 修改角色
    async editRole(data){
        let body = new URLSearchParams()
        body.append('rid', data.rid)
        body.append('pid', data.pid)
        body.append('name', data.name)
        body.append('mlist', data.mlist)
        body.append('desc', data.desc)
        return await http.post('/system/role/edit', body)
    },
    // 删除角色
    async deleteRole(rid){
        let body = new URLSearchParams()
        body.append('rid', rid)
        return await http.post('/system/role/delete', body)
    },
    // ---------------------------------------------- 用户api ----------------------------------------------
    // 用户列表
    async getUserList(query){
        return await http.get('/system/user/list', {params: query})
    },
    // 添加用户
    async addUser(data){
        let body = new URLSearchParams()
        body.append('account', data.account)
        body.append('password', data.password)
        body.append('username', data.username)
        body.append('gender', data.gender)
        body.append('phone', data.phone)
        body.append('enable', data.enable)
        body.append('rid', data.rid)
        body.append('desc', data.desc)
        return await http.post('/system/user/add', body)
    },
    // 修改用户
    async editUser(data){
        let body = new URLSearchParams()
        body.append('uid', data.uid)
        if (data.phone) body.append('phone', data.phone)
        if (data.enable != undefined) body.append('enable', data.enable)
        if (data.rid) body.append('rid', data.rid)
        if (data.desc) body.append('desc', data.desc)
        return await http.post('/system/user/edit', body)
    },
    // 删除用户
    async deleteUser(uid){
        let body = new URLSearchParams()
        body.append('uid', uid)
        return await http.post('/system/user/delete', body)
    },
    // 下载用户表格
    async downloadUser(){
        return await http.get('/system/user/excel')
    },
    // ---------------------------------------------- 日志api ----------------------------------------------
    // 日志列表
    async getLogList(query){
        return await http.get('/system/log/list', {params: query})
    },
    // 下载表格
    async downloadLog(){
        return await http.get('/system/log/excel')
    },
    // 清空日志
    async clearLog(){
        return await http.post('/system/log/delete')
    },
    // ---------------------------------------------- 平台账号 api ----------------------------------------------
    



    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------
    // ---------------------------------------------- XXXX api ----------------------------------------------

}
