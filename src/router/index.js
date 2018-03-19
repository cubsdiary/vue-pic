import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'main',
    component: resolve => { require(['@/components/main'], resolve) }
  }, {
    path: '/shopkeeper',
    name: 'shopkeeper',
    component: resolve => { require(['@/components/shopkeeper'], resolve) }
  }, {
    path: '/success',
    name: 'success',
    component: resolve => { require(['@/components/success'], resolve) }
  }]
})
