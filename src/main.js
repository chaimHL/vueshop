import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'
import './assets/less/global.less'

Vue.config.productionTip = false

// 将axios挂载到Vue的原型对象上，这样每个vue实例都能通过this.$http发起ajax请求
Vue.prototype.$http = axios
// 设置请求根路径
axios.defaults.baseURL = 'http://192.168.31.90:3000/'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
