import { APP_STATE_KEY, createEmptyState, EMPTY_RESULT } from "./constants"
import type { AppState, TargetCheckResult, TargetConfig } from "../types"

const storageArea = chrome.storage.local

function normalizeState(raw?: AppState): AppState {
  const base = createEmptyState()
  const state = raw ?? base
  const targets = Array.isArray(state.targets) ? state.targets : []
  const results = state.results && typeof state.results === "object" ? state.results : {}

  return {
    version: state.version ?? base.version,
    targets,
    results: Object.fromEntries(
      targets.map((target) => [target.id, results[target.id] ?? EMPTY_RESULT(target.id)]),
    ),
  }
}

export async function getAppState(): Promise<AppState> {
  const data = await storageArea.get(APP_STATE_KEY)
  return normalizeState(data[APP_STATE_KEY])
}

export async function saveAppState(nextState: AppState) {
  await storageArea.set({
    [APP_STATE_KEY]: normalizeState(nextState),
  })
}

export async function saveTargets(targets: TargetConfig[]) {
  const state = await getAppState()
  const nextResults = { ...state.results }

  for (const target of targets) {
    if (!nextResults[target.id]) {
      nextResults[target.id] = EMPTY_RESULT(target.id)
    }
  }

  for (const key of Object.keys(nextResults)) {
    if (!targets.some((target) => target.id === key)) {
      delete nextResults[key]
    }
  }

  await saveAppState({
    ...state,
    targets,
    results: nextResults,
  })
}

export async function saveTargetResult(result: TargetCheckResult) {
  const state = await getAppState()
  await saveAppState({
    ...state,
    results: {
      ...state.results,
      [result.targetId]: result,
    },
  })
}

export async function markTargetChecking(targetId: string) {
  const state = await getAppState()
  const current = state.results[targetId] ?? EMPTY_RESULT(targetId)
  await saveTargetResult({
    ...current,
    status: "checking",
    checkedAt: current.checkedAt,
    message: "正在检查中。",
  })
}
