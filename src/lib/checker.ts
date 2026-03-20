import {
  CHALLENGE_POLL_MS,
  EMPTY_RESULT,
  MAX_TEXT_LENGTH,
  PAGE_LOAD_POLL_MS,
} from "./constants"
import { delay, buildNotificationFingerprint } from "./utils"
import type { InspectSnapshot, TargetCheckResult, TargetConfig } from "../types"

function detectChallenge(snapshot: InspectSnapshot) {
  const title = snapshot.title.toLowerCase()

  return (
    snapshot.hasCfContent ||
    snapshot.hasCfWrapper ||
    snapshot.hasChallengePlatformScript ||
    snapshot.hasTurnstile ||
    snapshot.hasChallengeForm ||
    snapshot.hasCfChlOpt ||
    snapshot.hasCdnCgiPath ||
    snapshot.hasCfQuery ||
    title.includes("just a moment") ||
    title.includes("checking your browser") ||
    title.includes("attention required") ||
    title.includes("请稍候")
  )
}

function matchesSuccess(target: TargetConfig, finalUrl: string) {
  try {
    return new RegExp(target.successUrlPattern).test(finalUrl)
  } catch {
    return false
  }
}

function matchesOutOfStock(target: TargetConfig, text: string) {
  const lowerText = text.toLowerCase()
  return target.outOfStockKeywords.some((keyword) =>
    lowerText.includes(keyword.toLowerCase()),
  )
}

async function closeTab(tabId: number | undefined) {
  if (!tabId) return
  try {
    await chrome.tabs.remove(tabId)
  } catch {
    // ignore
  }
}

async function readSnapshot(tabId: number): Promise<InspectSnapshot | null> {
  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const bodyText = document.body?.innerText?.replace(/\s+/g, " ").trim() ?? ""
        const hasCfQuery = (() => {
          try {
            return Array.from(new URL(window.location.href).searchParams.keys()).some((key) =>
              key.startsWith("__cf_chl"),
            )
          } catch {
            return false
          }
        })()

        return {
          url: window.location.href,
          title: document.title ?? "",
          text: bodyText.slice(0, 4000),
          hasCfContent: Boolean(document.querySelector("#cf-content")),
          hasCfWrapper: Boolean(document.querySelector("#cf-wrapper")),
          hasChallengePlatformScript: Boolean(
            document.querySelector('script[src*="/cdn-cgi/challenge-platform/"]'),
          ),
          hasTurnstile: Boolean(
            document.querySelector(
              'script[src*="challenges.cloudflare.com/turnstile"], iframe[src*="challenges.cloudflare.com"]',
            ),
          ),
          hasChallengeForm: Boolean(
            document.querySelector(
              'form.challenge-form, form#challenge-form, form[action*="__cf_chl_f_tk"]',
            ),
          ),
          hasCfChlOpt: typeof (window as { _cf_chl_opt?: unknown })._cf_chl_opt === "object",
          hasCdnCgiPath: window.location.pathname.startsWith("/cdn-cgi/"),
          hasCfQuery,
        }
      },
    })

    return (injection?.result ?? null) as InspectSnapshot | null
  } catch {
    return null
  }
}

function createBaseResult(targetId: string): TargetCheckResult {
  return {
    ...EMPTY_RESULT(targetId),
    checkedAt: new Date().toISOString(),
  }
}

export async function inspectTarget(target: TargetConfig): Promise<TargetCheckResult> {
  let tabId: number | undefined
  const startedAt = Date.now()
  const timeoutMs = target.timeoutSeconds * 1000
  let lastSnapshot: InspectSnapshot | null = null
  let lastKnownUrl = target.checkUrl

  try {
    const tab = await chrome.tabs.create({ url: target.checkUrl, active: false })
    tabId = tab.id

    if (!tabId) {
      return {
        ...createBaseResult(target.id),
        status: "error",
        finalUrl: null,
        title: null,
        message: "没有拿到临时标签页。",
        challengeDetected: false,
      }
    }

    while (Date.now() - startedAt < timeoutMs) {
      const currentTab = await chrome.tabs.get(tabId)
      lastKnownUrl = currentTab.url ?? lastKnownUrl

      if (currentTab.status !== "complete") {
        await delay(PAGE_LOAD_POLL_MS)
        continue
      }

      lastSnapshot = await readSnapshot(tabId)
      const finalUrl = lastSnapshot?.url ?? currentTab.url ?? target.checkUrl
      const title = lastSnapshot?.title ?? currentTab.title ?? null
      const text = lastSnapshot?.text ?? ""
      const challengeDetected = lastSnapshot ? detectChallenge(lastSnapshot) : false

      if (matchesSuccess(target, finalUrl)) {
        return {
          ...createBaseResult(target.id),
          status: "success",
          finalUrl,
          title,
          message: "命中成功 URL 规则，已经可以购买。",
          challengeDetected: false,
          notificationFingerprint: buildNotificationFingerprint(target.id, finalUrl),
        }
      }

      if (text && matchesOutOfStock(target, text)) {
        return {
          ...createBaseResult(target.id),
          status: "out_of_stock",
          finalUrl,
          title,
          message: "页面内容命中了缺货关键词。",
          challengeDetected: false,
        }
      }

      if (challengeDetected) {
        await delay(CHALLENGE_POLL_MS)
        continue
      }

      return {
        ...createBaseResult(target.id),
        status: "unknown",
        finalUrl,
        title,
        message: text
          ? `没有命中成功规则，也没有命中缺货关键词。页面摘要：${text.slice(0, MAX_TEXT_LENGTH)}`
          : "页面已经打开，但没有拿到可判断的内容。",
        challengeDetected: false,
      }
    }

    return {
      ...createBaseResult(target.id),
      status: lastSnapshot && detectChallenge(lastSnapshot) ? "challenge_timeout" : "timeout",
      finalUrl: lastSnapshot?.url ?? lastKnownUrl,
      title: lastSnapshot?.title ?? null,
      message:
        lastSnapshot && detectChallenge(lastSnapshot)
          ? "页面一直停留在挑战状态，超时后结束本次检查。"
          : "页面加载超时，没能拿到稳定结果。",
      challengeDetected: Boolean(lastSnapshot && detectChallenge(lastSnapshot)),
    }
  } catch (error) {
    return {
      ...createBaseResult(target.id),
      status: "error",
      finalUrl: lastSnapshot?.url ?? lastKnownUrl,
      title: lastSnapshot?.title ?? null,
      message: error instanceof Error ? error.message : "检查过程出错。",
      challengeDetected: Boolean(lastSnapshot && detectChallenge(lastSnapshot)),
    }
  } finally {
    await closeTab(tabId)
  }
}
