import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/users/user.vue'
import Rigths from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Cates from '../components/goods/cates.vue'
import Params from '../components/goods/params.vue'
import Lists from '../components/goods/lists.vue'
import Add from '../components/goods/add.vue'
import Order from '../components/order/order.vue'

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
      { path: '/orders', component: Order }
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
