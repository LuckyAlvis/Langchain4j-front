import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.min.js'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import router from './router'

// 引入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})

// 挂载应用
app.mount('#app')
