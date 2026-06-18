<template>
  <n-modal :show="show" preset="dialog" :title="title" positive-text="确认" negative-text="取消" @positive-click="$emit('confirm')" @negative-click="$emit('cancel')" @esc="$emit('cancel')">
    {{ content }}
  </n-modal>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; title: string; content: string }>()
defineEmits<{ confirm: []; cancel: [] }>()
</script>
