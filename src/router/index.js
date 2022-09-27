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
    path: '/gesuch',
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
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/einstellungen',
    name: 'Settings',
    component: () => import('../views/Settings')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
