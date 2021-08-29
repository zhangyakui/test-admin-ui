import Vue from 'vue'
import Vuex from 'vuex'
import VueXAlong from 'vuex-along'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: {},// 当前登录账号信息 
        deptInfo: {},// 部门信息
        roleInfo: {},// 角色信息
        menuInfo: {},// 菜单信息
        routerInfo: {},// 路由信息

    },
    mutations: {// 同步变更
        setUserInfo: (state, userInfo) => state.userInfo = userInfo,
        setDeptInfo: (state, deptInfo) => state.deptInfo = deptInfo,
        setRoleInfo: (state, roleInfo) => state.roleInfo = roleInfo,
        setMenuInfo: (state, menuInfo) => state.menuInfo = menuInfo,
        setRouterInfo: (state, routerInfo) => state.routerInfo = routerInfo,
            
    },
    actions: {// 异步变更

    },
    getters: {// 取值
        getUserInfo: state => state.userInfo,
        getDeptInfo: state => state.deptInfo,
        getRoleInfo: state => state.roleInfo,
        getMenuInfo: state => state.menuInfo,
        getRouterInfo: state => state.routerInfo,
    },
    plugins: [VueXAlong()]// 刷新页面保存到localStore 防止数据丢失
})

