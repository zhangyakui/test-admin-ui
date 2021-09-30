import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'


Vue.use(Router)


// 登录页面
const loginPage = {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {keepAlive: true}
}

// 404页面 
const _404Page = {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue')
}

// 找不到页面
const noPage = {
    path: '*',
    name: 'no',
    component: () => import('../views/404.vue')
}

// 主页页面
let mainPage =  {
    path: '/',
    name: 'Index',
    redirect: '/wellcome',
    component: Index,
    children: [
        {
            path: '/wellcome',
            name: 'Wellcome',
            meta: {keepAlive: true},
            component: () => import('../views/Wellcome.vue')
        },
        // 系统管理
        {
            path: '/system/user',
            name: 'SysUser',
            meta: {keepAlive: true},
            component: () => import('../views/system/user.vue')
        },
        {
            path: '/system/role',
            name: 'SysRole',
            meta: {keepAlive: true},
            component: () => import('../views/system/role.vue')
        },
        {
            path: '/system/menu',
            name: 'SysMenu',
            meta: {keepAlive: true},
            component: () => import('../views/system/menu.vue')
        },
        {
            path: '/system/log',
            name: 'SysLog',
            meta: {keepAlive: false},
            component: () => import('../views/system/log.vue')
        },
        // 资产管理
        {
            path: '/assets/phone',
            name: 'AssetsPhone',
            meta: {keepAlive: true},
            component: () => import('../views/assets/phone.vue')
        },
        {
            path: '/assets/computer',
            name: 'AssetsComputer',
            meta: {keepAlive: true},
            component: () => import('../views/assets/computer.vue')
        },
        {
            path: '/assets/other',
            name: 'AssetsOther',
            meta: {keepAlive: true},
            component: () => import('../views/assets/other.vue')
        },
        // 审批管理
        {
            path: '/approve/reimburse',
            name: 'ApproveReimburse',
            meta: {keepAlive: true},
            component: () => import('../views/approve/reimburse.vue')
        },
        // 账号管理
        {
            path: '/account/phone',
            name: 'AccPhone',
            meta: {keepAlive: true},
            component: () => import('../views/account/phone.vue')
        },
        {
            path: '/account/qq',
            name: 'AccQq',
            meta: {keepAlive: true},
            component: () => import('../views/account/qq.vue')
        },
        {
            path: '/account/weixin',
            name: 'AccWeixin',
            meta: {keepAlive: true},
            component: () => import('../views/account/weixin.vue')
        },
        {
            path: '/account/qiehao',
            name: 'AccQiehao',
            meta: {keepAlive: true},
            component: () => import('../views/account/qiehao.vue')
        },
        {
            path: '/account/zhihu',
            name: 'AccZhihu',
            meta: {keepAlive: true},
            component: () => import('../views/account/zhihu.vue')
        },
        {
            path: '/account/baijiahao',
            name: 'AccBaijiahao',
            meta: {keepAlive: true},
            component: () => import('../views/account/baijiahao.vue')
        },
        // 邮件管理
        {
            path: '/email/ali',
            name: 'EmailAli',
            meta: {keepAlive: true},
            component: () => import('../views/email/ali.vue')
        },
        // 文件管理
        {
            path: '/file/office',
            name: 'FileOffice',
            meta: {keepAlive: true},
            component: () => import('../views/file/office.vue')
        },
        {
            path: '/file/script',
            name: 'FileScript',
            meta: {keepAlive: true},
            component: () => import('../views/file/script.vue')
        },
        {
            path: '/file/app',
            name: 'FileApp',
            meta: {keepAlive: true},
            component: () => import('../views/file/app.vue')
        }
    ]
}

const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [loginPage, mainPage, _404Page, noPage]
})


// 解决路由重复 重写 router.push 方法
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
}

// 全局守卫
router.beforeEach((to, from, next) => {
    if (window.localStorage.getItem('token')){// 判断token是否存在
        // 存在 判断是否去 登录页面
        if (to.path == '/login') return next(from.path)

        const menu = store.getters.getRouterInfo[to.path]
        if ((['/wellcome', '/404'].indexOf(to.path) == -1) && (!menu)){
            return next('/404')
        }

        if (['/wellcome', '/404'].indexOf(to.path) == -1){
            store.commit('addQuickList', {path: to.path, title: menu})// 设置快捷路由
        }
        
        // 路由追加 meta内容
        // store.getters.getMenuInfo.menus.forEach(category => {
        //     category.children.forEach(menu => {
        //         if (to.path == menu.path){
        //             to.meta.title = menu.meta.title
        //             to.meta.keepAlive = menu.meta.keepAlive
        //         }
        //     })
        // })
    }else{// 不存在
        if (to.path != '/login') return next('/login')
    }
    next()
})

export default router;
