import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/tree' },
  { path: '/tree', name: 'tree', component: () => import('@/pages/FamilyTree.vue') },
  { path: '/members/:id', name: 'member-detail', component: () => import('@/pages/MemberDetail.vue') },
  { path: '/stories', name: 'stories', component: () => import('@/pages/Stories.vue') },
  { path: '/photos', name: 'photos', component: () => import('@/pages/Photos.vue') },
  { path: '/legacy', name: 'legacy', component: () => import('@/pages/Legacy.vue') },
  { path: '/settings', name: 'settings', component: () => import('@/pages/Settings.vue') }
]
