import Vue from 'vue'
// 首页模板
import App from './App.vue'
// elementui引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入路由
import router from '@/router/router'

import store from './store'
// 样式
import '@/styles/index.scss'

// 富文本编辑器
// 图表
import ECharts from 'vue-echarts'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
// 导航守卫
router.beforeEach((to, from, next) => {
  // a 如果用户登录了，想要跳转到非登录页，我们就让它继续，不拦它
  // 登录（/login） 也不拦它
  // b 如果用户没有登录，想要跳转到非登录页， 我们要拦它，不让它跳转到首页，让它回到登录页
  // 登录（/login） 不拦它，让它继续
  let mytoken = localStorage.getItem('mytoken') || ''
  if (mytoken) {
    // 这里的条件是用户登录了，我们不拦它，让它一路下一步
    next()
  } else {
    // to.name必须和router/index.js中的路由规则的name对应
    if (to.name !== 'login') {
      // 未登录用户访问非登录页面，需要拦截下来，让它去到登录页
      next('/login')
    } else {
      // 未登录用户访问登录页面就直接让它访问
      next()
    }
  }
})
// 使用elementui
Vue.use(ElementUI)
// 不在提示
Vue.config.productionTip = false
// 初始化地图
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '6a204f2b675f32f8849ec4b6b7c21e5c',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})
Vue.use(VueQuillEditor)
Vue.component('chart', ECharts)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
