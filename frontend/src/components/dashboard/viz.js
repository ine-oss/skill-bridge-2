// Chart tokens — validated categorical palette (CVD-safe in this order) and chart chrome.
export const SERIES = ['#2a78d6', '#eb6834', '#1baf7a'] // blue, orange, aqua — fixed order, never cycled
export const INK = { primary: '#0b0b0b', secondary: '#52514e', muted: '#898781' }
export const GRID = '#e1e0d9'
export const AXIS = '#c3c2b7'
export const TRACK = '#e8f0fb' // light step of the blue ramp, for meter/bar tracks
export const STATUS = { good: '#0ca30c', goodText: '#006300', warning: '#fab219', critical: '#d03b3b', criticalText: '#b42318' }

export const axisProps = {
  tick: { fill: INK.muted, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: AXIS },
}

export const compact = (value) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value ?? 0)

/** Legend items for ChartCard that match a TrendChart's series. */
export const lineLegend = (series) => series.map((item, index) => ({ label: item.label, color: SERIES[index], shape: 'line' }))
