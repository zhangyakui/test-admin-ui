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
        quickList: [],// 快捷路由

    },
    mutations: {// 同步变更
        init: state => {
            state.userInfo = {}
            state.deptInfo = {}
            state.roleInfo = {}
            state.menuInfo = {}
            state.routerInfo = {}
            state.breadcrumbList = []
            state.quickList = []
        },
        setUserInfo: (state, userInfo) => state.userInfo = userInfo,
        setDeptInfo: (state, deptInfo) => state.deptInfo = deptInfo,
        setRoleInfo: (state, roleInfo) => state.roleInfo = roleInfo,
        setMenuInfo: (state, menuInfo) => state.menuInfo = menuInfo,
        setRouterInfo: (state, routerInfo) => state.routerInfo = routerInfo,
        addQuickList: (state, quick) => {
            const path = quick.path
            let isExists = false
            for (let i=0; i<state.quickList.length; i++){
                if (state.quickList[i].path == path){
                    isExists = true
                    break
                }
            }
            if (!isExists){
                state.quickList.push(quick)
            }
        },
        deleteQuickList: (state, quick) => {
            const path = quick.path
            for (let i=0; i<state.quickList.length; i++){
                if (state.quickList[i].path == path){
                    state.quickList.splice(i, 1)
                    break
                }
            }
            console.log(JSON.stringify(state.quickList))
        },
        clearQuickList: state => state.quickList = []
    },
    actions: {// 异步变更

    },
    getters: {// 取值
        getUserInfo: state => state.userInfo,
        getDeptInfo: state => state.deptInfo,
        getRoleInfo: state => state.roleInfo,
        getMenuInfo: state => state.menuInfo,
        getRouterInfo: state => state.routerInfo,
        getQuickList: state => state.quickList,
    },
    plugins: [VueXAlong()]// 刷新页面保存到localStore 防止数据丢失
})

