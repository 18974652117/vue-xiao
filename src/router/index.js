import Vue from 'vue'
import Router from 'vue-router'
const login = () => import('../components/login/login.vue')
Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: () => import('../components/home/home.vue'),
      redirect: '/welcome',
      children: [{ path: '/welcome', component: () => import('../components/home/welcome.vue') },
        { path: '/users', component: () => import('../components/user/users.vue') },
        { path: '/rights', component: () => import('../components/power/rights.vue') },
        { path: '/roles', component: () => import('../components/power/roles.vue') },
        { path: '/reports', component: () => import('../components/reports/reports.vue') },
        { path: '/categories', component: () => import('../components/goods/categories.vue') } // 商品分类
      ]
    }

  ],
  mode: 'history'
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  if (to.path === '/login') {
    return next()
  } else {
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')

    // 如果获取的 token 为空就强制跳转登录页，如果获取的token不为空就放行
    if (!tokenStr) {
      return next('/login')
    } else {
      next()
    }
  }
})
export default router
