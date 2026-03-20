<template>
  <section class="rounded-3xl bg-white p-6 shadow-panel ring-1 ring-line">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-ink">监听目标</h2>
        <p class="mt-1 text-sm text-soft">左边看结果，右边改配置。这里管理目标顺序和启停。</p>
      </div>
      <button
        class="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink"
        type="button"
        @click="$emit('create')"
      >
        新建目标
      </button>
    </div>

    <div class="mt-6 space-y-3">
      <article
        v-for="(target, index) in targets"
        :key="target.id"
        class="rounded-2xl px-4 py-4 transition"
        :class="selectedId === target.id ? 'bg-muted ring-1 ring-line' : 'bg-white ring-1 ring-slate-100'"
      >
        <div class="flex items-start justify-between gap-4">
          <button class="min-w-0 flex-1 text-left" type="button" @click="$emit('select', target.id)">
            <div class="flex items-center gap-3">
              <h3 class="truncate text-sm font-semibold text-ink">{{ target.name || '未命名目标' }}</h3>
              <StatusBadge :status="results[target.id]?.status ?? 'idle'" />
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs"
                :class="target.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ target.enabled ? '启用中' : '已停用' }}
              </span>
            </div>
            <p class="mt-2 break-all text-xs text-soft">{{ target.checkUrl || '还没有填写检查地址。' }}</p>
            <p class="mt-2 text-sm text-ink">{{ results[target.id]?.message || '还没有结果。' }}</p>
          </button>

          <div class="flex shrink-0 items-center gap-2">
            <button class="rounded-full border border-line px-3 py-2 text-xs" type="button" @click="$emit('moveUp', index)">上移</button>
            <button class="rounded-full border border-line px-3 py-2 text-xs" type="button" @click="$emit('moveDown', index)">下移</button>
            <button class="rounded-full border border-line px-3 py-2 text-xs" type="button" @click="$emit('toggle', target.id)">
              {{ target.enabled ? '停用' : '启用' }}
            </button>
            <button class="rounded-full border border-rose-200 px-3 py-2 text-xs text-rose-700" type="button" @click="$emit('remove', target.id)">
              删除
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import StatusBadge from "./StatusBadge.vue"
import type { TargetCheckResult, TargetConfig } from "../../types"

defineProps<{
  targets: TargetConfig[]
  selectedId: string | null
  results: Record<string, TargetCheckResult>
}>()

defineEmits<{
  create: []
  select: [targetId: string]
  moveUp: [index: number]
  moveDown: [index: number]
  toggle: [targetId: string]
  remove: [targetId: string]
}>()
</script>
