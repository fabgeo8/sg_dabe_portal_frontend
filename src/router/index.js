import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard')
  },
  {
    path: '/gesuche',
    name: 'Application',
    component: () => import('../views/Application')
  },
  {
    path: '/gesuchliste',
    name: 'Applicationlist',
    component: () => import('../views/Applicationlist')
  },
  {
    path: '/aktivitaet',
    name: 'Activities',
    component: () => import('../views/Activities')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
