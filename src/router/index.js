import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Mgr from '../services/SecurityService'
import Layout from "../views/Layout";
const auth = new Mgr()

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: Layout,
  children: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard')
    },
    {
      path: '/gesuch/:identifier',
      name: 'Application',
      props: true,
      component: () => import('../views/Application')
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
      path: '/me',
      name: 'Me',
      component: () => import('../views/Me')
    },
    {
      path: '/einstellungen',
      name: 'Settings',
      component: () => import('../views/Settings')
    },
    {
      path: '/error',
      name: 'Error',
      component: () => import('../views/Error')
    }
  ]},
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const DEFAULT_TITLE = 'Formularsystem Portal';
router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

router.beforeResolve((to, from, next)=>{
  if (to.name === 'Error') {
    next()
  }

  auth.getSignedIn()
      .then((isSignedIn) => {
        console.log("user is signed in " + isSignedIn)

        if (isSignedIn === false) {
          store.commit("userSignedOut")
        } else {
          store.commit('userSignedIn')
          store.dispatch('getUserApiInfo')
        }

        if ( to.name !== 'Login' && isSignedIn === false){
          // user is logged out update state
          next({
            path: 'login',
            replace: true
          })
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err)
        // error resolving user redirect to 500 page
        next({
          path: 'error',
          replace: true
        })
      })


})

export default router
