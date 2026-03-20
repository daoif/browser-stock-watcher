<template>
  <section class="rounded-3xl bg-white p-6 shadow-panel ring-1 ring-line">
    <div>
      <h2 class="text-lg font-semibold text-ink">目标配置</h2>
      <p class="mt-1 text-sm text-soft">保存时会请求对应站点的页面读取权限，用来判断缺货关键词和挑战页状态。</p>
    </div>

    <form class="mt-6 space-y-5" @submit.prevent="handleSubmit">
      <div class="grid gap-5 lg:grid-cols-2">
        <label class="space-y-2">
          <span class="text-sm font-medium text-ink">名称</span>
          <input v-model.trim="form.name" class="w-full rounded-2xl border border-line px-4 py-3 outline-none" type="text" placeholder="例如：DMIT 71" />
          <p v-if="errors.name" class="text-xs text-danger">{{ errors.name }}</p>
        </label>

        <label class="space-y-2">
          <span class="text-sm font-medium text-ink">是否启用</span>
          <button
            class="flex w-full items-center justify-between rounded-2xl border border-line px-4 py-3 text-left"
            type="button"
            @click="form.enabled = !form.enabled"
          >
            <span class="text-sm text-ink">{{ form.enabled ? '启用后会参与启动检查和定时检查。' : '停用后保留配置，但不会执行检查。' }}</span>
            <span class="rounded-full px-3 py-1 text-xs" :class="form.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'">
              {{ form.enabled ? '启用中' : '已停用' }}
            </span>
          </button>
        </label>
      </div>

      <label class="space-y-2">
        <span class="text-sm font-medium text-ink">检查地址</span>
        <input v-model.trim="form.checkUrl" class="w-full rounded-2xl border border-line px-4 py-3 outline-none" type="url" placeholder="https://example.com/cart.php?a=add&pid=71" />
        <p v-if="errors.checkUrl" class="text-xs text-danger">{{ errors.checkUrl }}</p>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-ink">成功 URL 正则</span>
        <input v-model.trim="form.successUrlPattern" class="w-full rounded-2xl border border-line px-4 py-3 font-mono text-sm outline-none" type="text" placeholder="cart\.php\?a=confproduct&i=\d+$" />
        <p v-if="errors.successUrlPattern" class="text-xs text-danger">{{ errors.successUrlPattern }}</p>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-medium text-ink">缺货关键词</span>
        <textarea v-model="keywordText" class="min-h-36 w-full rounded-2xl border border-line px-4 py-3 outline-none" placeholder="每行一个，例如：&#10;缺货中&#10;Out of stock"></textarea>
        <p class="text-xs text-soft">每行一个关键词，命中任意一个就判定为缺货。</p>
        <p v-if="errors.outOfStockKeywords" class="text-xs text-danger">{{ errors.outOfStockKeywords }}</p>
      </label>

      <div class="grid gap-5 lg:grid-cols-2">
        <label class="space-y-2">
          <span class="text-sm font-medium text-ink">检查间隔（分钟）</span>
          <input v-model.number="form.intervalMinutes" class="w-full rounded-2xl border border-line px-4 py-3 outline-none" min="1" type="number" />
          <p v-if="errors.intervalMinutes" class="text-xs text-danger">{{ errors.intervalMinutes }}</p>
        </label>

        <label class="space-y-2">
          <span class="text-sm font-medium text-ink">最长等待（秒）</span>
          <input v-model.number="form.timeoutSeconds" class="w-full rounded-2xl border border-line px-4 py-3 outline-none" min="5" type="number" />
          <p v-if="errors.timeoutSeconds" class="text-xs text-danger">{{ errors.timeoutSeconds }}</p>
        </label>
      </div>

      <label class="space-y-2">
        <span class="text-sm font-medium text-ink">备注</span>
        <textarea v-model.trim="form.notes" class="min-h-28 w-full rounded-2xl border border-line px-4 py-3 outline-none" placeholder="这里可以写测试说明、购买链接说明或站点特点。"></textarea>
      </label>

      <p v-if="saveError" class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ saveError }}</p>

      <div class="flex flex-wrap gap-3">
        <button class="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white" type="submit">保存配置</button>
        <button class="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink" type="button" @click="$emit('reset')">恢复当前选中项</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { keywordsToText, normalizeKeywords } from "../../lib/utils"
import { validateTarget } from "../../lib/validation"
import type { TargetConfig } from "../../types"

const props = defineProps<{
  target: TargetConfig
  saveError: string
}>()

const emit = defineEmits<{
  submit: [target: TargetConfig]
  reset: []
}>()

const form = ref<TargetConfig>({ ...props.target })
const keywordText = ref(keywordsToText(props.target.outOfStockKeywords))
const errors = ref<Partial<Record<keyof TargetConfig, string>>>({})

watch(
  () => props.target,
  (next) => {
    form.value = { ...next }
    keywordText.value = keywordsToText(next.outOfStockKeywords)
    errors.value = {}
  },
  { deep: true, immediate: true },
)

const normalizedTarget = computed<TargetConfig>(() => ({
  ...form.value,
  outOfStockKeywords: normalizeKeywords(keywordText.value),
}))

function handleSubmit() {
  const validation = validateTarget(normalizedTarget.value)
  errors.value = validation.errors

  if (!validation.valid) {
    return
  }

  emit("submit", normalizedTarget.value)
}
</script>
