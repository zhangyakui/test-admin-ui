import Vue from 'vue';
import App from './App.vue';
import store from './store/index.js';

import api from './utils/api.js';// 接口
import tool from './utils/tool.js';// 工具
import csv from 'csv-exportor';// 表格

// 全局样式
import './assets/css/global.css';

// 引入路由
import router from './router/index.js';

// 引入 Element UI 组件
import './assets/js/element.js';

// 挂载
Vue.prototype.$api = api;
Vue.prototype.$tool = tool;
Vue.prototype.$csv = csv




// 阻止启动生产消息
Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
