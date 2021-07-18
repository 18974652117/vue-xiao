import './assets/fonts/iconfont.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/globa.css'	// 导入全局样式

// 导入 表格插件 
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

// 导入 echarts 图表
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
