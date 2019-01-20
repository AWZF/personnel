import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
    },
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      redirect: { name: 'welcome' },
      children: [
        {
          path: 'welcome',
          name: 'welcome',
          component: () => import(/* webpackChunkName: "welcome" */ '@/views/Welcome.vue')
        },
        {
          path: 'users',
          name: 'users',
          component: () => import(/* webpackChunkName: "users" */ '@/views/Users.vue')
        },
        {
          name: 'rights',
          path: 'rights',
          component: () => import(/* webpackChunkName: "rights" */ '@/views/auth/Rights.vue')
        },
        {
          name: 'roles',
          path: 'roles',
          component: () => import(/* webpackChunkName: "roles" */ '@/views/auth/Roles.vue')
        },
        {
          name: 'addGoods',
          path: 'addGoods',
          component: () => import(/* webpackChunkName: "addGoods" */ '@/views/goods/AddGoods.vue')
        },
        {
          name: 'goods',
          path: 'goods',
          component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Goods.vue')
        },
        {
          name: 'categories',
          path: 'categories',
          component: () => import(/* webpackChunkName: "Categories" */ '@/views/goods/Categories.vue')
        },
        {
          name: 'map',
          path: 'map',
          component: () => import(/* webpackChunkName: "Categories" */ '@/views/Map.vue')
        },
        {
          name: 'reports',
          path: 'reports',
          component: () => import(/* webpackChunkName: "Categories" */ '@/views/Reports.vue')
        }
      ]

    }
  ]
})
