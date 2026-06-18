import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { installGuards } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes
})

installGuards(router)

export default router
