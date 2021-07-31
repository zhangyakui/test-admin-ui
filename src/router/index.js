import Vue from 'vue'
import App from '../App.vue'
import Router from 'vue-router'

import Login from '../views/Login.vue'
import Index from '../views/Index.vue'


Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Main',
            redirect: '/index',
            component: App,
            children: [
                {
                    path: '/login',
                    name: 'Login',
                    component: Login,
                    meta: {keepAlive: true}
                },
                {
                    path: '/index',
                    name: 'Index',
                    component: Index,
                    meta: {keepAlive: true},
                    children: [
                        {
                            path: '/user/account',
                            name: 'userAccount',
                            component: () =>import('../views/userManager/user.vue')
                        }
                    ]
                },
                {
                    path: '/*',
                    name: '404',
                    component: () => import('../views/404.vue')
                }
            ]
        },
        // {
        //     path: '/',
        //     name: 'Main',
        //     component: App,
        //     children: [
        //         {
        //             path: '/index',
        //             name: 'Index',
        //             component: Index,
        //             meta: {keepAlive: true}
        //         },
        //     ]
        // }

        // {
        //     path: '/',
        //     name: 'Main',
        //     component: App,
        //     childrens: [
        //         {
        //             path: '/login',
        //             name: 'Login',
        //             component: Login,
        //             meta: {keepAlive: true}
        //         },
        //         {
        //             path: '/index',
        //             name: 'Index',
        //             component: Index,
        //             meta: {keepAlive: true}
        //         },
        //     ]
        // }
    ]
})

export default router;


