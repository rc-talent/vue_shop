import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})
// 为路由对象，添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径；from 代表那个路径跳转而来；next 是一个函数 表示放行
  // 访问的是login页面 直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取token值
  let isToken = window.sessionStorage.getItem('token')
  // 判断sessionStorage 中是否有token值，没有则强制跳转login页面
  if (!isToken) return next('/login')
  next()
})

export default router
