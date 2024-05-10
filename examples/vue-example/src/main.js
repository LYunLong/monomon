import { createApp } from 'vue'
import App from './App.vue'

import {createRouter ,createWebHashHistory} from 'vue-router'


import FrontEndWork from './components/FrontEndWork.vue'
import Live2d from './components/Live2d.vue'


const routes = [
    { path: '/', component: FrontEndWork },
    { path: '/live2d', component: Live2d },
  ]
  
const router = createRouter({
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
  })
  
  createApp(App).use(router).mount('#app')
  // createApp(App).mount('#app')
