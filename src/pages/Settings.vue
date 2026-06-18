<template>
  <section class="page-grid">
    <div class="page-heading"><p>设置</p><h1>加密、导入导出与主题</h1></div>
    <section class="panel">
      <h2>加密设置</h2>
      <n-alert :type="encryptionReady ? 'success' : 'warning'">当前状态：{{ encryptionReady ? '密钥已在本次会话解锁' : '关闭页面后需重新输入密码' }} · {{ encryptionHint }}</n-alert>
      <n-input v-model:value="password" type="password" show-password-on="click" placeholder="设置或修改加密密码" />
      <n-button type="primary" @click="setPassword(password, '本地会话密钥')">保存密码</n-button>
      <n-button @click="lockEncryption">锁定会话密钥</n-button>
    </section>
    <section class="panel">
      <h2>数据管理</h2>
      <n-space>
        <n-button @click="exportData(false)">导出 JSON</n-button>
        <n-button @click="exportData(true)">加密导出 JSON</n-button>
        <n-upload :show-file-list="false" accept=".ged" @change="importGedcom"><n-button>导入 GEDCOM</n-button></n-upload>
      </n-space>
    </section>
    <section class="panel">
      <h2>主题设置</h2>
      <n-radio-group v-model:value="theme" @update:value="updateTheme">
        <n-radio-button value="light">浅色</n-radio-button>
        <n-radio-button value="dark">深色</n-radio-button>
      </n-radio-group>
    </section>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import type { UploadFileInfo } from 'naive-ui'
import { useFamilyStore } from '@/stores/familyStore'
import { useStoryStore } from '@/stores/storyStore'
import { usePhotoStore } from '@/stores/photoStore'
import { useLegacyStore } from '@/stores/legacyStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { buildExportPayload, downloadJson } from '@/utils/export'
import { parseGedcom } from '@/utils/gedcom-parser'

const password = ref('')
const settings = useSettingsStore()
const family = useFamilyStore()
const story = useStoryStore()
const photo = usePhotoStore()
const legacy = useLegacyStore()
const { encryptionReady, encryptionHint, theme } = storeToRefs(settings)
const { setPassword, lockEncryption, setTheme } = settings

async function exportData(encrypted: boolean) {
  const payload = await buildExportPayload({ family: family.members, stories: story.stories, photos: photo.photos, legacyPlans: legacy.plans }, encrypted)
  downloadJson(payload)
}

async function importGedcom(options: { file: UploadFileInfo }) {
  const raw = options.file.file
  if (!raw) return
  const members = parseGedcom(await raw.text())
  for (const member of members) await family.addMember(member)
}

function updateTheme(value: string | number) {
  setTheme(value as 'light' | 'dark')
}

onMounted(async () => {
  await Promise.all([family.hydrate(), story.hydrate(), photo.hydrate(), legacy.hydrate()])
})
</script>
