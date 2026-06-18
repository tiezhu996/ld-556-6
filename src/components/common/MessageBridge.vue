<template></template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { registerMessageApi } from '@/utils/error-handler'

registerMessageApi(useMessage())
</script>
