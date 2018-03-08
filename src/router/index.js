import Vue from 'vue'
import Router from 'vue-router'

import * as firebase from 'firebase'

import CharList from '@/components/CharList'
import Char from '@/components/Char'
import ItemList from '@/components/ItemList'
import Item from '@/components/Item'
import PendingList from '@/components/PendingList'
import Login from '@/components/Login'
import Account from '@/components/Account'
import Custom from '@/components/Custom'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/items',
      name: 'ItemList',
      component: ItemList
    },
    {
      path: '/item/:name',
      name: 'Item',
      component: Item,
      props: true
    },
    {
      path: '/',
      alias: '/chars',
      name: 'CharList',
      component: CharList
    },
    {
      path: '/char/:name',
      name: 'Char',
      component: Char,
      props: true
    },
    {
      path: '/admin',
      name: 'PendingList',
      component: PendingList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/:id',
      name: 'Account',
      component: Account,
      props: true,
    },
    {
      path: '/custom/:type/:id',
      name: 'Custom',
      component: Custom,
      props: true,
    },
    {
      path: '*',
      redirect: {
        name: 'CharList'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router