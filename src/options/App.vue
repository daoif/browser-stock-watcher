<script setup lang="ts">
import { createDefaultTarget, createEmptyState } from "../lib/constants"
import { ensureOriginPermission } from "../lib/permissions"
import { getAppState, saveTargets } from "../lib/storage"
import RecentActivity from "./components/RecentActivity.vue"
import TargetForm from "./components/TargetForm.vue"
import TargetList from "./components/TargetList.vue"
import type { AppState, TargetConfig } from "../types"
import { computed, onMounted, ref } from "vue"

const state = ref<AppState>(createEmptyState())
const selectedId = ref<string | null>(null)
const draftTarget = ref<TargetConfig>(createDefaultTarget())
const saveError = ref("")
const formVersion = ref(0)

const selectedTarget = computed(() => {
  if (!selectedId.value) {
    return draftTarget.value
  }

  return state.value.targets.find((target) => target.id === selectedId.value) ?? draftTarget.value
})

const resultItems = computed(() =>
  state.value.targets.map((target) => ({
    target,
    result: state.value.results[target.id],
  })),
)

async function refreshState() {
  state.value = await getAppState()
  if (selectedId.value && !state.value.targets.some((target) => target.id === selectedId.value)) {
    selectedId.value = null
  }
}

function createTarget() {
  selectedId.value = null
  saveError.value = ""
  draftTarget.value = createDefaultTarget()
  formVersion.value += 1
}

function selectTarget(targetId: string) {
  selectedId.value = targetId
  saveError.value = ""
  formVersion.value += 1
}

async function persistTargets(targets: TargetConfig[]) {
  await saveTargets(targets)
  await refreshState()
}

async function saveTarget(target: TargetConfig) {
  saveError.value = ""
  const permission = await ensureOriginPermission(target.checkUrl)

  if (!permission.granted) {
    saveError.value = permission.error ?? "没有拿到页面读取权限。"
    return
  }

  const nextTargets = [...state.value.targets]
  const existingIndex = nextTargets.findIndex((item) => item.id === target.id)

  if (existingIndex >= 0) {
    nextTargets.splice(existingIndex, 1, target)
  } else {
    nextTargets.unshift(target)
  }

  await persistTargets(nextTargets)
  selectedId.value = target.id
  formVersion.value += 1
}

async function removeTarget(targetId: string) {
  const nextTargets = state.value.targets.filter((target) => target.id !== targetId)
  await persistTargets(nextTargets)
  if (selectedId.value === targetId) {
    createTarget()
  }
}

async function toggleTarget(targetId: string) {
  const nextTargets = state.value.targets.map((target) =>
    target.id === targetId ? { ...target, enabled: !target.enabled } : target,
  )
  await persistTargets(nextTargets)
}

async function moveTargetUp(index: number) {
  if (index <= 0) return
  const nextTargets = [...state.value.targets]
  ;[nextTargets[index - 1], nextTargets[index]] = [nextTargets[index], nextTargets[index - 1]]
  await persistTargets(nextTargets)
}

async function moveTargetDown(index: number) {
  if (index >= state.value.targets.length - 1) return
  const nextTargets = [...state.value.targets]
  ;[nextTargets[index + 1], nextTargets[index]] = [nextTargets[index], nextTargets[index + 1]]
  await persistTargets(nextTargets)
}

function resetSelected() {
  saveError.value = ""
  if (!selectedId.value) {
    draftTarget.value = createDefaultTarget()
  }
  formVersion.value += 1
}

async function runAllNow() {
  await chrome.runtime.sendMessage({ type: "run-all-now" })
}

async function runOneNow(targetId: string) {
  await chrome.runtime.sendMessage({ type: "run-target-now", targetId })
}

onMounted(async () => {
  await refreshState()
  chrome.storage.onChanged.addListener(async (_changes, areaName) => {
    if (areaName === "local") {
      await refreshState()
    }
  })
})
</script>

<template>
  <main class="min-h-screen bg-paper px-6 py-8 lg:px-10">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex flex-col gap-4 rounded-[32px] bg-white px-8 py-7 shadow-panel ring-1 ring-line lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-medium uppercase tracking-[0.24em] text-soft">Browser Stock Watcher</p>
          <h1 class="mt-2 text-3xl font-semibold text-ink">库存监听设置</h1>
          <p class="mt-3 max-w-3xl text-sm leading-6 text-soft">
            这里直接配置你的监听目标。浏览器启动后会自动检查，浏览器开着时也会按间隔继续运行。命中成功规则后，会把通知推到系统通知区。
          </p>
        </div>
        <div class="flex flex-wrap gap-3 text-sm text-soft">
          <span class="rounded-full bg-muted px-4 py-2">点击扩展图标会直接打开这个页面</span>
          <span class="rounded-full bg-muted px-4 py-2">不做浮窗，只做标准通知</span>
        </div>
      </header>

      <RecentActivity :items="resultItems" @run-all="runAllNow" @run-one="runOneNow" />

      <div class="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <TargetList
          :targets="state.targets"
          :selected-id="selectedId"
          :results="state.results"
          @create="createTarget"
          @select="selectTarget"
          @move-up="moveTargetUp"
          @move-down="moveTargetDown"
          @toggle="toggleTarget"
          @remove="removeTarget"
        />

        <TargetForm
          :key="formVersion"
          :target="selectedTarget"
          :save-error="saveError"
          @submit="saveTarget"
          @reset="resetSelected"
        />
      </div>
    </div>
  </main>
</template>
