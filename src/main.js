import Vue from 'vue'
import App from './App.vue'

// 全局样式
import './assets/css/global.css'

// 引入路由
import router from './router/index.js'

// 引入 Element UI 组件
import './assets/js/element.js'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
