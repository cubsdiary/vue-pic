// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import FastClick from 'fastclick'

import '@/common/stylus/reast.css'
import api from '@/common/js/api'

FastClick.attach(document.body)
Vue.use(Vueaxios, axios)
Vue.use(api)

Vue.config.productionTip = false

axios.defaults.baseURL = ''
Vue.prototype.baseUrl = axios.defaults.baseURL
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
