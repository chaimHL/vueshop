import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'
import './assets/less/global.less'
// 导入第三方的树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入 NProgress 包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 设置请求根路径
axios.defaults.baseURL = 'http://192.168.1.107:3000/'

// axios请求拦截
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start()
  // 为请求头对象(config.headers)，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
// axios响应拦截
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})

// 将axios挂载到Vue的原型对象上，这样每个vue实例都能通过this.$http发起ajax请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 第三方树形表格
Vue.component('tree-table', TreeTable)

// 注册富文本编辑器为全局可用组件
Vue.use(VueQuillEditor)

// 日期格式过滤器
Vue.filter('dateFormat', originVal => {
  const dt = new Date(originVal)
  // 年月日
  const y = dt.getFullYear()
  // 因为 padStart 是字符串方法,所以时间后面加一个''把数字类型转换成字符串类型
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  // 时分秒
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
