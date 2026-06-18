<template>
  <div class="tree-panel">
    <TreeControls
      @search="searchMember"
      @zoom-in="scaleBy(1.2)"
      @zoom-out="scaleBy(0.82)"
      @center="centerTree"
      @fullscreen="toggleFullscreen"
      @add="$emit('add')"
      @export-image="exportImage"
    />
    <div ref="stage" class="tree-stage">
      <svg ref="svgRef" role="img" aria-label="交互式家谱树">
        <g ref="viewportRef">
          <path v-for="link in links" :key="link.key" :d="link.path" class="tree-link" />
          <line v-for="line in spouseLines" :key="line.key" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" class="spouse-link" />
          <TreeNode v-for="item in nodes" :key="item.node.id" :node="item.node" :x="item.x" :y="item.y" @select="$emit('select', $event)" @menu="$emit('menu', $event)" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import TreeControls from './TreeControls.vue'
import TreeNode from './TreeNode.vue'
import type { FamilyTreeNode } from '@/types/family'

const props = defineProps<{ roots: FamilyTreeNode[] }>()
const emit = defineEmits<{ select: [id: string]; menu: [id: string]; add: [] }>()

const svgRef = ref<SVGSVGElement | null>(null)
const viewportRef = ref<SVGGElement | null>(null)
const stage = ref<HTMLDivElement | null>(null)
const transform = ref(d3.zoomIdentity.translate(80, 80))

const hierarchy = computed(() => {
  const root = props.roots.length === 1 ? props.roots[0] : { ...props.roots[0], id: 'virtual-root', name: '家族根', children: props.roots }
  return d3.tree<FamilyTreeNode>().nodeSize([150, 130])(d3.hierarchy(root as FamilyTreeNode))
})

const nodes = computed(() =>
  hierarchy.value.descendants().filter((item) => item.data.id !== 'virtual-root').map((item) => ({ node: item.data, x: item.x, y: item.y }))
)

const links = computed(() =>
  hierarchy.value.links().filter((item) => item.source.data.id !== 'virtual-root').map((item) => ({
    key: `${item.source.data.id}-${item.target.data.id}`,
    path: `M${item.source.x},${item.source.y + 36}C${item.source.x},${(item.source.y + item.target.y) / 2} ${item.target.x},${(item.source.y + item.target.y) / 2} ${item.target.x},${item.target.y - 36}`
  }))
)

const spouseLines = computed(() => {
  const positions = new Map(nodes.value.map((item) => [item.node.id, item]))
  return nodes.value.flatMap((item) =>
    item.node.spouseIds
      .filter((id) => item.node.id < id && positions.has(id))
      .map((id) => {
        const spouse = positions.get(id)!
        return { key: `${item.node.id}-${id}`, x1: item.x + 36, y1: item.y, x2: spouse.x - 36, y2: spouse.y }
      })
  )
})

function applyTransform() {
  if (viewportRef.value) d3.select(viewportRef.value).attr('transform', transform.value.toString())
}

function scaleBy(amount: number) {
  transform.value = transform.value.scale(amount)
  applyTransform()
}

function centerTree() {
  transform.value = d3.zoomIdentity.translate(380, 70)
  applyTransform()
}

function searchMember(query: string) {
  const found = nodes.value.find((item) => item.node.name.includes(query))
  if (found) {
    transform.value = d3.zoomIdentity.translate(420 - found.x, 210 - found.y)
    applyTransform()
    emit('select', found.node.id)
  }
}

function toggleFullscreen() {
  stage.value?.requestFullscreen?.()
}

function exportImage() {
  const svg = svgRef.value
  if (!svg) return
  const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'legacytree-family-tree.svg'
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  if (!svgRef.value || !viewportRef.value) return
  const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.4, 2.8]).on('zoom', (event) => {
    transform.value = event.transform
    applyTransform()
  })
  d3.select(svgRef.value).call(zoom)
  centerTree()
})

watch(() => props.roots, () => nextTick(centerTree), { deep: true })
</script>
