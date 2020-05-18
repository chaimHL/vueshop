import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'
import './assets/less/global.less'
// 导入第三方的树形表格
import TreeTable from 'vue-table-with-tree-grid'

// 设置请求根路径
axios.defaults.baseURL = 'http://192.168.1.107:3000/'

// axios请求拦截
axios.interceptors.request.use(config => {
  // 为请求头对象(config.headers)，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})

// 将axios挂载到Vue的原型对象上，这样每个vue实例都能通过this.$http发起ajax请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 第三方树形表格
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
