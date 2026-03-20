export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const normalizeKeywords = (raw: string) =>
  raw
    .split(/\r?\n|,|，/u)
    .map((item) => item.trim())
    .filter(Boolean)

export const keywordsToText = (keywords: string[]) => keywords.join("\n")

export const safeParseUrl = (value: string) => {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

export const getOriginPattern = (value: string) => {
  const url = safeParseUrl(value)
  return url ? `${url.origin}/*` : null
}

export const formatTime = (value: string | null) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString()
}

export const buildNotificationFingerprint = (targetId: string, finalUrl: string) =>
  `${targetId}::${finalUrl}`

export const trimText = (value: string, max = 120) => {
  if (value.length <= max) return value
  return `${value.slice(0, max)}…`
}
