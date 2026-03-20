export type CheckStatus =
  | "idle"
  | "checking"
  | "success"
  | "out_of_stock"
  | "challenge_timeout"
  | "permission_required"
  | "timeout"
  | "error"
  | "unknown"

export type TargetConfig = {
  id: string
  name: string
  enabled: boolean
  checkUrl: string
  successUrlPattern: string
  outOfStockKeywords: string[]
  intervalMinutes: number
  timeoutSeconds: number
  notes: string
}

export type TargetCheckResult = {
  targetId: string
  status: CheckStatus
  checkedAt: string | null
  finalUrl: string | null
  title: string | null
  message: string
  challengeDetected: boolean
  notificationFingerprint: string | null
}

export type AppState = {
  version: number
  targets: TargetConfig[]
  results: Record<string, TargetCheckResult>
}

export type ValidationResult = {
  valid: boolean
  errors: Partial<Record<keyof TargetConfig, string>>
}

export type BackgroundMessage =
  | { type: "run-all-now" }
  | { type: "run-target-now"; targetId: string }
  | { type: "open-options" }

export type InspectSnapshot = {
  url: string
  title: string
  text: string
  hasCfContent: boolean
  hasCfWrapper: boolean
  hasChallengePlatformScript: boolean
  hasTurnstile: boolean
  hasChallengeForm: boolean
  hasCfChlOpt: boolean
  hasCdnCgiPath: boolean
  hasCfQuery: boolean
}
