import type { Router } from 'vue-router'

export function installGuards(router: Router) {
  router.beforeEach((to) => {
    document.title = to.name ? `LegacyTree - ${String(to.name)}` : 'LegacyTree'
    return true
  })
}
