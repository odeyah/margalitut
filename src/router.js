import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Menu from './pages/Menu.vue'
import Gallery from './pages/Gallery.vue'
import About from './pages/About.vue'
import Quote from './pages/Quote.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/menu', name: 'menu', component: Menu },
  { path: '/gallery', name: 'gallery', component: Gallery },
  { path: '/about', name: 'about', component: About },
  { path: '/quote', name: 'quote', component: Quote },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router
