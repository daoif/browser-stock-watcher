import { DEFAULT_INTERVAL_MINUTES, DEFAULT_TIMEOUT_SECONDS } from "./constants"
import { safeParseUrl } from "./utils"
import type { TargetConfig, ValidationResult } from "../types"

export function validateTarget(input: TargetConfig): ValidationResult {
  const errors: ValidationResult["errors"] = {}

  if (!input.name.trim()) {
    errors.name = "需要填写一个便于区分的名称。"
  }

  if (!input.checkUrl.trim()) {
    errors.checkUrl = "需要填写检查地址。"
  } else if (!safeParseUrl(input.checkUrl.trim())) {
    errors.checkUrl = "检查地址不是有效 URL。"
  }

  if (!input.successUrlPattern.trim()) {
    errors.successUrlPattern = "需要填写成功 URL 正则。"
  } else {
    try {
      new RegExp(input.successUrlPattern)
    } catch {
      errors.successUrlPattern = "成功 URL 正则无效。"
    }
  }

  if (!input.outOfStockKeywords.length) {
    errors.outOfStockKeywords = "至少填写一个缺货关键词。"
  }

  if (!Number.isFinite(input.intervalMinutes) || input.intervalMinutes < 1) {
    errors.intervalMinutes = `检查间隔不能小于 1 分钟，推荐 ${DEFAULT_INTERVAL_MINUTES} 分钟以上。`
  }

  if (!Number.isFinite(input.timeoutSeconds) || input.timeoutSeconds < 5) {
    errors.timeoutSeconds = `超时时间不能小于 5 秒，推荐 ${DEFAULT_TIMEOUT_SECONDS} 秒。`
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
