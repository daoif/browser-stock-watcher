import type { AppState, TargetCheckResult, TargetConfig } from "../types"

export const APP_STATE_KEY = "browser_stock_watcher_state"
export const APP_STATE_VERSION = 1
export const DEFAULT_INTERVAL_MINUTES = 5
export const DEFAULT_TIMEOUT_SECONDS = 20
export const CHALLENGE_POLL_MS = 1500
export const PAGE_LOAD_POLL_MS = 300
export const RUN_GAP_MS = 1000
export const MAX_TEXT_LENGTH = 4000

export const EMPTY_RESULT = (targetId: string): TargetCheckResult => ({
  targetId,
  status: "idle",
  checkedAt: null,
  finalUrl: null,
  title: null,
  message: "还没有运行过。",
  challengeDetected: false,
  notificationFingerprint: null,
})

export const createDefaultTarget = (): TargetConfig => ({
  id: crypto.randomUUID(),
  name: "",
  enabled: true,
  checkUrl: "",
  successUrlPattern: "",
  outOfStockKeywords: [],
  intervalMinutes: DEFAULT_INTERVAL_MINUTES,
  timeoutSeconds: DEFAULT_TIMEOUT_SECONDS,
  notes: "",
})

export const createEmptyState = (): AppState => ({
  version: APP_STATE_VERSION,
  targets: [],
  results: {},
})
