import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name:'layout',// 如果父路由 有默认子路由，那么它的name将没有意义
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由,只能有1个
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa', // 默认子路由
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video', // 默认子路由
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my', // 默认子路由
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
