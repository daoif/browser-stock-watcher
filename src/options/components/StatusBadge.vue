<template>
  <span :class="badgeClass">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { CheckStatus } from "../../types"

const props = defineProps<{ status: CheckStatus }>()

const label = computed(() => {
  const labels: Record<CheckStatus, string> = {
    idle: "未运行",
    checking: "检查中",
    success: "可购买",
    out_of_stock: "缺货中",
    challenge_timeout: "挑战超时",
    permission_required: "缺权限",
    timeout: "超时",
    error: "错误",
    unknown: "未知",
  }
  return labels[props.status]
})

const badgeClass = computed(() => {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
  const mapping: Record<CheckStatus, string> = {
    idle: "bg-slate-100 text-slate-600",
    checking: "bg-amber-50 text-amber-700",
    success: "bg-emerald-50 text-emerald-700",
    out_of_stock: "bg-slate-100 text-slate-700",
    challenge_timeout: "bg-orange-50 text-orange-700",
    permission_required: "bg-rose-50 text-rose-700",
    timeout: "bg-orange-50 text-orange-700",
    error: "bg-rose-50 text-rose-700",
    unknown: "bg-sky-50 text-sky-700",
  }
  return `${base} ${mapping[props.status]}`
})
</script>
