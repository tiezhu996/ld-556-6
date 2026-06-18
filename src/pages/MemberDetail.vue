<template>
  <section v-if="member" class="detail-page">
    <div class="profile-hero">
      <MemberAvatar :member="member" size="lg" :deceased="Boolean(member.deathDate)" />
      <div>
        <p>成员档案</p>
        <h1>{{ member.name }}</h1>
        <span>{{ genderLabels[member.gender] }} · {{ lifeYears(member) }} · {{ member.birthPlace || '籍贯未知' }}</span>
      </div>
    </div>
    <n-grid :cols="2" :x-gap="18" :y-gap="18" responsive="screen">
      <n-gi>
        <section class="panel"><h2>个人简介</h2><p>{{ member.bio }}</p></section>
        <section class="panel"><h2>关联成员</h2><p>父母：{{ relations(member.id).parent?.name || '未记录' }}</p><p>配偶：{{ relations(member.id).spouses.map((item) => item.name).join('、') || '未记录' }}</p><p>子女：{{ relations(member.id).children.map((item) => item.name).join('、') || '未记录' }}</p></section>
      </n-gi>
      <n-gi>
        <section class="panel"><h2>家族故事</h2><TimelineView :items="storyItems" /></section>
      </n-gi>
    </n-grid>
    <section class="panel"><h2>老照片</h2><MediaGallery :items="galleryItems" /></section>
    <section class="panel"><h2>遗产规划</h2><n-list><n-list-item v-for="plan in memberPlans" :key="plan.id">{{ legacyTypeLabels[plan.type] }} · {{ plan.status }} · {{ plan.content }}</n-list-item></n-list></section>
  </section>
  <EmptyState v-else title="成员不存在" description="请回到家谱树选择一个有效成员。" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MemberAvatar from '@/components/common/MemberAvatar.vue'
import TimelineView from '@/components/common/TimelineView.vue'
import MediaGallery from '@/components/common/MediaGallery.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useFamily } from '@/hooks/useFamily'
import { useStory } from '@/hooks/useStory'
import { usePhoto } from '@/hooks/usePhoto'
import { useLegacyStore } from '@/stores/legacyStore'
import { genderLabels, legacyTypeLabels } from '@/constants/enums'
import { lifeYears } from '@/utils/member-status'

const route = useRoute()
const { hydrate, getById, relations } = useFamily()
const story = useStory()
const photo = usePhoto()
const legacy = useLegacyStore()
const member = computed(() => getById(String(route.params.id)))
const storyItems = computed(() => story.byMember(String(route.params.id)).map((item) => ({ id: item.id, title: item.title, description: item.content, date: item.date })))
const galleryItems = computed(() => photo.byMember(String(route.params.id)).map((item) => ({ id: item.id, url: item.restoredUrl || item.imageUrl, caption: item.caption, year: item.year, meta: item.location })))
const memberPlans = computed(() => legacy.byMember(String(route.params.id)))

onMounted(async () => {
  await Promise.all([hydrate(), story.hydrate(), photo.hydrate(), legacy.hydrate()])
})
</script>
