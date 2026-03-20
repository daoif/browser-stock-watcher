import type { TargetCheckResult, TargetConfig } from "../types"

const notificationToUrl = new Map<string, string>()

export function registerNotificationClickHandler() {
  chrome.notifications.onClicked.addListener(async (notificationId) => {
    const url = notificationToUrl.get(notificationId)
    if (!url) return
    await chrome.tabs.create({ url, active: true })
    notificationToUrl.delete(notificationId)
    await chrome.notifications.clear(notificationId)
  })

  chrome.notifications.onClosed.addListener((notificationId) => {
    notificationToUrl.delete(notificationId)
  })
}

export async function sendSuccessNotification(target: TargetConfig, result: TargetCheckResult) {
  const notificationId = `stock-success-${target.id}`
  const targetUrl = result.finalUrl ?? target.checkUrl

  notificationToUrl.set(notificationId, targetUrl)

  await chrome.notifications.create(notificationId, {
    type: "basic",
    iconUrl: chrome.runtime.getURL("/icon/128.png"),
    title: `${target.name || "目标"} 已可购买`,
    message: result.finalUrl ?? "命中了成功 URL 规则，点击通知打开页面。",
    priority: 2,
  })
}
