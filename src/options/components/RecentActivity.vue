<template>
  <section class="rounded-3xl bg-white p-6 shadow-panel ring-1 ring-line">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-ink">最近结果</h2>
        <p class="mt-1 text-sm text-soft">这里显示每个目标最近一次检查的状态。</p>
      </div>
      <button
        class="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white"
        type="button"
        @click="$emit('runAll')"
      >
        立即检查全部
      </button>
    </div>

    <div class="mt-6 space-y-3">
      <article
        v-for="item in items"
        :key="item.target.id"
        class="rounded-2xl bg-muted px-4 py-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-3">
              <h3 class="truncate text-sm font-semibold text-ink">{{ item.target.name || '未命名目标' }}</h3>
              <StatusBadge :status="item.result.status" />
            </div>
            <p class="mt-2 break-all text-xs text-soft">{{ item.target.checkUrl || '还没有填写检查地址。' }}</p>
            <p class="mt-2 text-sm text-ink">{{ item.result.message }}</p>
            <div class="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-soft">
              <span>最近检查：{{ formatTime(item.result.checkedAt) }}</span>
              <span>最终地址：{{ item.result.finalUrl || '-' }}</span>
            </div>
          </div>
          <button
            class="rounded-full border border-line px-3 py-2 text-xs font-medium text-ink"
            type="button"
            @click="$emit('runOne', item.target.id)"
          >
            只检查这个
          </button>
        </div>
      </article>

      <div
        v-if="!items.length"
        class="rounded-2xl bg-muted px-4 py-8 text-sm text-soft"
      >
        还没有目标。先在右侧添加一个目标。
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatTime } from "../../lib/utils"
import StatusBadge from "./StatusBadge.vue"
import type { TargetCheckResult, TargetConfig } from "../../types"

defineProps<{
  items: Array<{ target: TargetConfig; result: TargetCheckResult }>
}>()

defineEmits<{
  runAll: []
  runOne: [targetId: string]
}>()
</script>
