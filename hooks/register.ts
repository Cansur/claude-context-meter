import type { Register, SessionContextUsage, SessionCost, SessionRateLimit } from 'claude-code'

const WARN_PERCENT = 80
const BAR_CELLS = 20
const LIMIT_BAR_CELLS = 10
const MINUTE_MS = 60_000

const LIMIT_LABELS: Record<string, string> = { five_hour: '5h', seven_day: '7d' }

type Usage = { context: SessionContextUsage; rateLimits: SessionRateLimit[]; cost?: SessionCost }

const formatBar = (percent: number, cells: number): string => {
  const filled = Math.min(Math.max(Math.round((percent / 100) * cells), 0), cells)

  return `[${'█'.repeat(filled)}${'░'.repeat(cells - filled)}]`
}

const formatUntil = (resetsAt: string | undefined, now: number): string => {
  const at = resetsAt ? Date.parse(resetsAt) : NaN
  if (Number.isNaN(at)) {
    return ''
  }

  const minutes = Math.max(Math.round((at - now) / MINUTE_MS), 0)
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const rest = minutes % 60
  const span = days > 0 ? `${days}d${hours}h` : hours > 0 ? `${hours}h${rest}m` : `${rest}m`

  return ` (리셋 ${span} 후)`
}

const formatContext = (context: SessionContextUsage): string => {
  const used = context.tokens ?? 0
  const percent = context.percent ?? Math.round((used / context.window) * 100)
  const warn = percent >= WARN_PERCENT ? ' ⚠' : ''

  return `token ${formatBar(percent, BAR_CELLS)} ${percent}%${warn}`
}

const formatLimits = (limits: SessionRateLimit[], now: number): string =>
  limits
    .map(l => {
      const label = LIMIT_LABELS[l.kind] ?? l.kind
      const bar = formatBar(l.percentUsed, LIMIT_BAR_CELLS)

      return ` · ${label} ${bar} ${l.percentUsed}%${formatUntil(l.resetsAt, now)}`
    })
    .join('')

const formatLine = ({ context, rateLimits, cost }: Usage, now: number): string => {
  const usd = cost ? ` · API환산 $${cost.usd.toFixed(2)}` : ''

  return `${formatContext(context)}${formatLimits(rateLimits, now)}${usd}`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    $.ui.status(formatLine(await $.session.usage(), await $.clock.now()))

    return result
  })

  on('session.measure', async ($, e, next) => {
    $.ui.status(formatLine(e, await $.clock.now()))

    return next(e)
  })
}
