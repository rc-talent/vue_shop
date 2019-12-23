import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import GlobalCrumbs from './components/GlobalCrumbs.vue'

// 全局样式导入
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// 配置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求头对象 添加Token验证的 Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将axios挂载到vue全局
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 全局挂载面包屑导航
Vue.component('crumbs-navigation', GlobalCrumbs)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
