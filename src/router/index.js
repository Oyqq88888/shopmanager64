import Vue from 'vue'
import Router from 'vue-router'
//import Login from '../components/login.vue'
import Login from '@/components/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: ''
    },
    {
      name: 'logon',
      path: '/login',
      component: Login
    }
  ]
})
