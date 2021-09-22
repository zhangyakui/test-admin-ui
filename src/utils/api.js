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
        if (data.type != 2) body.append('path', data.path)
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
        if (data.type != 2) body.append('path', data.path)
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
        body.append('title', data.title)
        body.append('mlist', data.mlist)
        body.append('desc', data.desc)
        return await http.post('/system/role/add', body)
    },
    // 修改角色
    async editRole(data){
        let body = new URLSearchParams()
        body.append('rid', data.rid)
        body.append('pid', data.pid)
        body.append('title', data.title)
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
        body.append('userName', data.userName)
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
        if (data.enable != undefined && data.enable.length != 0) body.append('enable', data.enable)
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
    // 导出用户
    async downloadUser(){
        return await http.get('/system/user/excel')
    },
    // ---------------------------------------------- 日志api ----------------------------------------------
    // 日志列表
    async getLogList(query){
        return await http.get('/system/log/list', {params: query})
    },
    // 日志表格
    async downloadLog(){
        return await http.get('/system/log/excel')
    },
    // 清空日志
    async clearLog(){
        return await http.post('/system/log/delete')
    },
        // ---------------------------------------------- 手机 api ----------------------------------------------
    // 手机号列表
    async getMobPhoneList(query){
        return await http.get('/assets/phone/list', {params: query})
    },
    // 添加手机
    async addMobPhone(data){
        let body = new URLSearchParams()
        body.append('type', data.type)
        body.append('phoneId', data.phoneId)
        body.append('name', data.name)
        body.append('brand', data.brand)
        body.append('model', data.model)
        body.append('sysVer', data.sysVer)
        body.append('memory', data.memory)
        body.append('disk', data.disk)
        body.append('devNum', data.devNum)
        body.append('status', data.status)
        body.append('desc', data.desc)
        return await http.post('/assets/phone/add', body)
    },
    // 编辑手机
    async editMobPhone(data){
        let body = new URLSearchParams()
        body.append('id', data.id)
        body.append('phoneId', data.phoneId)
        body.append('name', data.name)
        body.append('sysVer', data.sysVer)
        body.append('disk', data.disk)
        body.append('status', data.status)
        body.append('desc', data.desc)
        return await http.post('/assets/phone/edit', body)
    },
    // 删除手机
    async deleteMobPhone(id){
        let body = new URLSearchParams()
        body.append('id', id)
        return await http.post('/assets/phone/delete', body)
    },
    // 导出手机
    async downloadMobPhone(){
        return await http.get('/assets/phone/excel')
    },
    // ---------------------------------------------- 手机号 api ----------------------------------------------
    // 手机号列表
    async getPhoneList(query){
        return await http.get('/account/phone/list', {params: query})
    },
    // 添加手机号
    async addPhone(data){
        let body = new URLSearchParams()
        body.append('agent', data.agent)
        body.append('operator', data.operator)
        body.append('cardName', data.cardName)
        body.append('number', data.number)
        body.append('iccid', data.iccid)
        body.append('puk', data.puk)
        body.append('local', data.local)
        body.append('realInfo', data.realInfo)
        body.append('status', data.status)
        body.append('desc', data.desc)
        return await http.post('/account/phone/add', body)
    },
    // 编辑手机号
    async editPhone(data){
        let body = new URLSearchParams()
        body.append('id', data.id)
        body.append('agent', data.agent)
        body.append('operator', data.operator)
        body.append('cardName', data.cardName)
        body.append('number', data.number)
        body.append('iccid', data.iccid)
        body.append('puk', data.puk)
        body.append('local', data.local)
        body.append('realInfo', data.realInfo)
        body.append('status', data.status)
        body.append('desc', data.desc)
        return await http.post('/account/phone/edit', body)
    },
    // 删除手机号
    async deletePhone(id){
        let body = new URLSearchParams()
        body.append('id', id)
        return await http.post('/account/phone/delete', body)
    },
    // 导出手机号
    async downloadPhone(){
        return await http.get('/account/phone/excel')
    },
    // ---------------------------------------------- QQ号 api ----------------------------------------------
    // QQ列表
    async getQQList(query){
        return await http.get('/account/qq/list', {params: query})
    },
    // 添加QQ号
    async addQQ(data){
        let body = new URLSearchParams()
        body.append('account', data.account)
        body.append('password', data.password)
        body.append('nickName', data.nickName)
        body.append('level', data.level)
        body.append('phone', data.phone)
        body.append('abnormal', data.abnormal)
        body.append('status', data.status)
        body.append('desc', data.desc)
        return await http.post('/account/qq/add', body)
    },
    // 编辑QQ号
    async editQQ(data){
        let body = new URLSearchParams()
        body.append('id', data.id)
        body.append('password', data.password)
        body.append('nickName', data.nickName)
        body.append('level', data.level)
        body.append('phone', data.phone)
        body.append('abnormal', data.abnormal)
        body.append('status', data.status)
        body.append('desc', data.desc)
        return await http.post('/account/qq/edit', body)
    },
    // 删除QQ号
    async deleteQQ(id){
        let body = new URLSearchParams()
        body.append('id', id)
        return await http.post('/account/qq/delete', body)
    },
    // 导出QQ号
    async downloadQQ(){
        return await http.get('/account/qq/excel')
    },
    // ---------------------------------------------- 微信号 api ----------------------------------------------
    // 微信列表
    async getWeiXinList(query){
        return await http.get('/account/weixin/list', {params: query})
    },
    // 添加微信号
    async addWeiXin(data){
        let body = new URLSearchParams()
        body.append('account', data.account)
        body.append('password', data.password)
        body.append('nickName', data.nickName)
        body.append('uid', data.uid)
        body.append('phone', data.phone)
        body.append('abnormal', data.abnormal)
        body.append('status', data.status)
        body.append('desc', data.desc)
        return await http.post('/account/weixin/add', body)
    },
    // 编辑微信号
    async editWeiXin(data){
        let body = new URLSearchParams()
        body.append('id', data.id)
        body.append('password', data.password)
        body.append('nickName', data.nickName)
        body.append('uid', data.uid)
        body.append('phone', data.phone)
        body.append('abnormal', data.abnormal)
        body.append('status', data.status)
        body.append('desc', data.desc)
        return await http.post('/account/weixin/edit', body)
    },
    // 删除微信号
    async deleteWeiXin(id){
        let body = new URLSearchParams()
        body.append('id', id)
        return await http.post('/account/weixin/delete', body)
    },
    // 导出微信号
    async downloadWeiXin(){
        return await http.get('/account/weixin/excel')
    },
    // ---------------------------------------------- 企鹅号 api ----------------------------------------------
    // 企鹅列表
    async getQiEHaoList(query){
        return await http.get('/account/qiehao/list', {params: query})
    },
    // 添加企鹅号
    async addQiEHao(data){
        let body = new URLSearchParams()
        body.append('category', data.category)
        body.append('account', data.account)
        body.append('password', data.password)
        body.append('nickName', data.nickName)
        body.append('phone', data.phone)
        body.append('abnormal', data.abnormal)
        body.append('status', data.status)
        // body.append('cookies', data.cookies)
        // body.append('userInfo', data.userInfo)
        // body.append('worksInfo', data.worksInfo)
        body.append('desc', data.desc)
        return await http.post('/account/qiehao/add', body)
    },
    // 编辑企鹅号
    async editQiEHao(type, data){
        let body = new URLSearchParams()
        body.append('id', data.id)
        if (type == 'base'){
            body.append('category', data.category)
            body.append('account', data.account)
            body.append('password', data.password)
            body.append('nickName', data.nickName)
            body.append('phone', data.phone)
            body.append('abnormal', data.abnormal)
            body.append('status', data.status)
            body.append('desc', data.desc)
        }else if (type == 'image'){
            body.append('platform', data.platform)
            body.append('homeLink', data.homeLink)
            body.append('startTime', data.startTime)
            body.append('endTime', data.endTime)
        }

        // body.append('cookies', data.cookies)
        // body.append('userInfo', data.userInfo)
        // body.append('worksInfo', data.worksInfo)
        return await http.post('/account/qiehao/edit', body)
    },
    // 删除企鹅号
    async deleteQiEHao(id){
        let body = new URLSearchParams()
        body.append('id', id)
        return await http.post('/account/qiehao/delete', body)
    },
    // 导出企鹅号
    async downloadQiEHao(){
        return await http.get('/account/qiehao/excel')
    },
    // ---------------------------------------------- 知乎 api ----------------------------------------------
    // 知乎列表
    async getZhiHuList(query){
        return await http.get('/account/zhihu/list', {params: query})
    },
    // 添加知乎
    async addZhiHu(data){
        let body = new URLSearchParams()
        body.append('category', data.category)
        body.append('account', data.account)
        body.append('password', data.password)
        body.append('nickName', data.nickName)
        body.append('phone', data.phone)
        body.append('abnormal', data.abnormal)
        body.append('status', data.status)
        // body.append('cookies', data.cookies)
        // body.append('userInfo', data.userInfo)
        // body.append('worksInfo', data.worksInfo)
        body.append('desc', data.desc)
        return await http.post('/account/zhihu/add', body)
    },
    // 编辑知乎
    async editZhiHu(type, data){
        let body = new URLSearchParams()
        body.append('id', data.id)
        if (type == 'base'){
            body.append('category', data.category)
            body.append('account', data.account)
            body.append('password', data.password)
            body.append('nickName', data.nickName)
            body.append('phone', data.phone)
            body.append('abnormal', data.abnormal)
            body.append('status', data.status)
            body.append('desc', data.desc)
        }else if (type == 'image'){
            body.append('platform', data.platform)
            body.append('homeLink', data.homeLink)
            body.append('startTime', data.startTime)
            body.append('endTime', data.endTime)
        }

        // body.append('cookies', data.cookies)
        // body.append('userInfo', data.userInfo)
        // body.append('worksInfo', data.worksInfo)
        return await http.post('/account/zhihu/edit', body)
    },
    // 删除知乎
    async deleteZhiHu(id){
        let body = new URLSearchParams()
        body.append('id', id)
        return await http.post('/account/zhihu/delete', body)
    },
    // 导出知乎
    async downloadZhiHu(){
        return await http.get('/account/zhihu/excel')
    },

        
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
    // ---------------------------------------------- 三方 api ----------------------------------------------
}
