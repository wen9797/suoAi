import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import nav from '@/components/nav/index'
import login from '@/components/login/login'
import config from '@/components/config/index'
import shop from '@/components/shop/index'


Vue.use(Router)

export default new Router({
  //base: '/public/',
  //mode: 'history',
  routes: [
    {
      path: '/',
      name: 'nav',
      component: nav,
      redirect: '/index',
      children:[
        //首页
        {
          path: '/index',
          name: 'index',
          component: index
        },
        {
          path: '/config',
          name: 'config',
          component: config
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/nav',
      name: 'nav',
      component: nav
    },
    {
      path: '/shop',
      name: 'index',
      component: index
    },
  ]
})
