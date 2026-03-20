import { defineBackground } from "wxt/utils/define-background"
import { RUN_GAP_MS } from "../src/lib/constants"
import { inspectTarget } from "../src/lib/checker"
import { sendSuccessNotification, registerNotificationClickHandler } from "../src/lib/notifications"
import { getAppState, markTargetChecking, saveTargetResult } from "../src/lib/storage"
import { delay } from "../src/lib/utils"
import type { BackgroundMessage, TargetConfig, TargetCheckResult } from "../src/types"

const runningTargets = new Set<string>()
let queue = Promise.resolve()

function alarmName(targetId: string) {
  return `target:${targetId}`
}

async function openOptionsPage() {
  const optionsUrl = chrome.runtime.getURL("options.html")
  const existingTabs = await chrome.tabs.query({ url: optionsUrl })
  const existingTab = existingTabs[0]

  if (existingTab?.id) {
    await chrome.tabs.update(existingTab.id, { active: true })
    if (typeof existingTab.windowId === "number") {
      await chrome.windows.update(existingTab.windowId, { focused: true })
    }
    return
  }

  await chrome.tabs.create({ url: optionsUrl, active: true })
}

async function saveResult(target: TargetConfig, result: TargetCheckResult) {
  const state = await getAppState()
  const previous = state.results[target.id]
  await saveTargetResult(result)

  if (
    result.status === "success" &&
    result.notificationFingerprint &&
    previous?.notificationFingerprint !== result.notificationFingerprint
  ) {
    await sendSuccessNotification(target, result)
  }
}

async function runTarget(target: TargetConfig) {
  if (!target.enabled || runningTargets.has(target.id)) {
    return
  }

  runningTargets.add(target.id)
  await markTargetChecking(target.id)

  try {
    const result = await inspectTarget(target)
    await saveResult(target, result)
  } finally {
    runningTargets.delete(target.id)
  }
}

function enqueue(task: () => Promise<void>) {
  queue = queue.then(task, task)
  return queue
}

async function syncAlarms() {
  const state = await getAppState()
  const enabledTargets = state.targets.filter((target) => target.enabled)
  const alarms = await chrome.alarms.getAll()
  const validNames = new Set(enabledTargets.map((target) => alarmName(target.id)))

  await Promise.all(
    alarms
      .filter((alarm) => alarm.name.startsWith("target:") && !validNames.has(alarm.name))
      .map((alarm) => chrome.alarms.clear(alarm.name)),
  )

  await Promise.all(
    enabledTargets.map((target) =>
      chrome.alarms.create(alarmName(target.id), {
        delayInMinutes: target.intervalMinutes,
        periodInMinutes: target.intervalMinutes,
      }),
    ),
  )
}

async function runAllTargets() {
  const state = await getAppState()
  const targets = state.targets.filter((target) => target.enabled)

  for (const target of targets) {
    await enqueue(async () => {
      await runTarget(target)
      await delay(RUN_GAP_MS)
    })
  }
}

async function runSingleTarget(targetId: string) {
  const state = await getAppState()
  const target = state.targets.find((item) => item.id === targetId)
  if (!target) return

  await enqueue(async () => {
    await runTarget(target)
  })
}

function registerRuntimeHandlers() {
  registerNotificationClickHandler()

  chrome.action.onClicked.addListener(() => {
    void openOptionsPage()
  })

  chrome.runtime.onStartup.addListener(() => {
    void syncAlarms()
    void runAllTargets()
  })

  chrome.runtime.onInstalled.addListener(() => {
    void syncAlarms()
  })

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return
    if (!Object.keys(changes).some((key) => key.includes("browser_stock_watcher_state"))) {
      return
    }
    void syncAlarms()
  })

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (!alarm.name.startsWith("target:")) return
    const targetId = alarm.name.replace("target:", "")
    void runSingleTarget(targetId)
  })

  chrome.runtime.onMessage.addListener((message: BackgroundMessage, _sender, sendResponse) => {
    if (message.type === "run-all-now") {
      void runAllTargets().then(() => sendResponse({ success: true }))
      return true
    }

    if (message.type === "run-target-now") {
      void runSingleTarget(message.targetId).then(() => sendResponse({ success: true }))
      return true
    }

    if (message.type === "open-options") {
      void openOptionsPage().then(() => sendResponse({ success: true }))
      return true
    }

    return false
  })
}

export default defineBackground({
  type: "module",
  main() {
    registerRuntimeHandlers()
  },
})
