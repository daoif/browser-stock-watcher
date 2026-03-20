import { getOriginPattern } from "./utils"

export async function ensureOriginPermission(url: string) {
  const origin = getOriginPattern(url)
  if (!origin) {
    return { granted: false, error: "URL 无法解析。" }
  }

  const contains = await chrome.permissions.contains({ origins: [origin] })
  if (contains) {
    return { granted: true, origin }
  }

  const granted = await chrome.permissions.request({ origins: [origin] })
  return {
    granted,
    origin,
    error: granted ? undefined : `没有获得 ${origin} 的页面读取权限。`,
  }
}
