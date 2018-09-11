import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/Main').default
    },
    {
      path: '/manual',
      name: 'manual',
      component: require('@/components/Manual').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
