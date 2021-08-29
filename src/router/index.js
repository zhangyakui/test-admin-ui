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

// 主页页面
let mainPage =  {
    path: '/',
    name: 'Index',
    redirect: '/wellcome',
    component: Index,
    children: [
        {
            path: '/wellcome',
            name: 'wellcome',
            component: () => import('../views/Wellcome.vue')
        },
        // 系统管理
        {
            path: '/system/user',
            name: 'user',
            component: () => import('../views/system/user.vue')
        },
        {
            path: '/system/role',
            name: 'role',
            component: () => import('../views/system/role.vue')
        },
        {
            path: '/system/menu',
            name: 'menu',
            component: () => import('../views/system/menu.vue')
        },
        // 账号管理
        {
            path: '/account/qq',
            name: 'qq',
            component: () => import('../views/account/qq.vue')
        },
        {
            path: '/account/weixin',
            name: 'weixin',
            component: () => import('../views/account/weixin.vue')
        },
        // 文件管理
        {
            path: '/file/office',
            name: 'office',
            component: () => import('../views/file/office.vue')
        },
        {
            path: '/file/script',
            name: 'script',
            component: () => import('../views/file/script.vue')
        },
        {
            path: '/file/app',
            name: 'app',
            component: () => import('../views/file/app.vue')
        }
    ]
}


const router = new Router({
    mode: 'history',
    routes: [loginPage, mainPage, _404Page]
})


// 全局守卫
router.beforeEach((to, from, next) => {
    if (window.localStorage.getItem('token')){// 判断token是否存在
        // 存在 判断是否去 登录页面
        if (to.path == '/login'){// 是 跳转当前路由
            return next(from.path)
        }

        if ((['/wellcome', '/404'].indexOf(to.path) == -1) && (!store.getters.getRouterInfo[to.path])){
            return next('/404')
        }

    }else{// 不存在
        if (to.path != '/login'){
            return next('/login')
        }
    }
    next()
})


export default router;


