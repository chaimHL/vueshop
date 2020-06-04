import Vue from 'vue'
import VueRouter from 'vue-router'
// 按需加载路由,webpackChunkName的值相同的组件会被打包在同个异步块 (chunk) 中
// 原本这样写的：import Login from '../components/login.vue'
const Login = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/login.vue')
const Home = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName: "Login-Home-Welcome" */ '../components/welcome.vue')

const Users = () => import(/* webpackChunkName: "Users-Rigths-Roles" */ '../components/users/user.vue')
const Rigths = () => import(/* webpackChunkName: "Users-Rigths-Roles" */ '../components/power/rights.vue')
const Roles = () => import(/* webpackChunkName: "Users-Rigths-Roles" */ '../components/power/roles.vue')

const Cates = () => import(/* webpackChunkName: "Cates-Params" */ '../components/goods/cates.vue')
const Params = () => import(/* webpackChunkName: "Cates-Params" */ '../components/goods/params.vue')

const Lists = () => import(/* webpackChunkName: "Lists-Add" */ '../components/goods/lists.vue')
const Add = () => import(/* webpackChunkName: "Lists-Add" */ '../components/goods/add.vue')

const Order = () => import(/* webpackChunkName: "Order-Reports" */ '../components/order/order.vue')
const Reports = () => import(/* webpackChunkName: "Order-Reports" */ '../components/report/reports.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rigths },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cates },
      { path: '/params', component: Params },
      { path: '/goods', component: Lists },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 为路由对象添加beforeEach导航守卫
router.beforeEach((to, from, next) => {
  // 如果访问登录页，直接放行
  if (to.path === '/login') return next()
  // 访问其他需要权限的页面就看看有没有token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
