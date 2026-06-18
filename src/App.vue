<template>
  <n-config-provider :theme="theme === 'dark' ? darkTheme : null">
    <n-message-provider>
      <MessageBridge />
      <n-layout class="app-shell">
        <n-layout-header class="topbar">
          <RouterLink class="brand" to="/tree">
            <span class="brand-mark">L</span>
            <span>LegacyTree</span>
          </RouterLink>
          <nav class="nav">
            <RouterLink v-for="item in navItems" :key="item.path" :to="item.path">{{ item.label }}</RouterLink>
          </nav>
        </n-layout-header>
        <n-layout-content class="content">
          <RouterView />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { storeToRefs } from 'pinia'
import MessageBridge from '@/components/common/MessageBridge.vue'
import { useSettingsStore } from '@/stores/settingsStore'

const { theme } = storeToRefs(useSettingsStore())

const navItems = [
  { path: '/tree', label: '家谱树' },
  { path: '/stories', label: '故事' },
  { path: '/photos', label: '照片' },
  { path: '/legacy', label: '遗产规划' },
  { path: '/settings', label: '设置' }
]
</script>
